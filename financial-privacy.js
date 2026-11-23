// Financial records never belong in crew-readable tool documents.
export const FINANCIAL_FIELDS=['purchaseDate','purchasePrice','retailer','warrantyExpiry','receiptURL','receiptPath','receiptName','replacementCost','replacementCostReviewedAt','replacementCostBasis'];
export function splitFinancial(data){const publicData={},financial={};for(const [key,value] of Object.entries(data)){(FINANCIAL_FIELDS.includes(key)?financial:publicData)[key]=value}return {publicData,financial}}
export function createFinancialPrivacy(api){
 const {db,storage,doc,collection,getDocs,getDoc,setDoc,updateDoc,runTransaction,writeBatch,deleteField,ref,uploadBytes,getDownloadURL,deleteObject,isAdmin}=api;
 const records=new Map(),isTool=r=>r?.parent?.id==='tools';
 function route(tx,method,r,data,options){if(!isTool(r))return tx[method](r,data,...(options?[options]:[]));const {publicData,financial}=splitFinancial(data);if(Object.keys(financial).length&&isAdmin())tx.set(doc(db,'toolFinancials',r.id),financial,{merge:true});if(Object.keys(publicData).length)tx[method](r,publicData,...(options?[options]:[]));}
 function transaction(tx){return new Proxy(tx,{get(target,key){if(['set','update'].includes(key))return (r,d,o)=>route(target,key,r,d,o);const v=target[key];return typeof v==='function'?v.bind(target):v}})}
 async function write(method,r,d,o){if(!isTool(r))return method==='set'?setDoc(r,d,...(o?[o]:[])):updateDoc(r,d);const batch=writeBatch(db);route(batch,method,r,d,o);await batch.commit();if(isAdmin())records.set(r.id,{...records.get(r.id),...splitFinancial(d).financial})}
 async function prepare(){
  records.clear();if(!isAdmin())return;
  // Copy before removing fields; each asset moves atomically and can be retried.
  const all=await getDocs(collection(db,'tools'));
  for(const item of all.docs){if(!Object.keys(splitFinancial(item.data()).financial).length)continue;await runTransaction(db,async tx=>{const live=await tx.get(item.ref);const {financial}=splitFinancial(live.data());if(!Object.keys(financial).length)return;tx.set(doc(db,'toolFinancials',item.id),financial,{merge:true});tx.update(item.ref,Object.fromEntries(Object.keys(financial).map(k=>[k,deleteField()])))});}
  const financials=await getDocs(collection(db,'toolFinancials'));
  for(const item of financials.docs){let data=item.data();
   if(data.receiptLegacyPath){await deleteObject(ref(storage,data.receiptLegacyPath));await updateDoc(item.ref,{receiptLegacyPath:deleteField()});delete data.receiptLegacyPath}
   if(data.receiptPath&&!data.receiptPath.startsWith('financial-files/')){
    // Replace the old shared object, then delete it so its old download token stops working.
    if(!data.receiptURL)throw Error('A legacy receipt has no download URL. Financial migration needs review.');
    const response=await fetch(data.receiptURL);if(!response.ok)throw Error('Could not secure an existing receipt. Please retry before crew use.');
    const blob=await response.blob(),path=`financial-files/${item.id}/migrated-${crypto.randomUUID()}`;
    await uploadBytes(ref(storage,path),blob,{contentType:blob.type||'application/pdf'});
    const url=await getDownloadURL(ref(storage,path));await updateDoc(item.ref,{receiptPath:path,receiptURL:url,receiptLegacyPath:data.receiptPath});
    await deleteObject(ref(storage,data.receiptPath));await updateDoc(item.ref,{receiptLegacyPath:deleteField()});data={...data,receiptPath:path,receiptURL:url};
   }records.set(item.id,data);
  }
  // Historical value notes were previously visible to crew too.
  const history=await getDocs(collection(db,'history'));
  for(const item of history.docs)if(/insurance|replacement cost/i.test(item.data().action||'')){const batch=writeBatch(db);batch.set(doc(db,'financialHistory',item.id),item.data());batch.delete(item.ref);await batch.commit()}
 }
 return {records,prepare,transaction,set:(r,d,o)=>write('set',r,d,o),update:(r,d)=>write('update',r,d)};
}
