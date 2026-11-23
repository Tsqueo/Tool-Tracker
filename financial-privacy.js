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
  let pendingReceipts=0;for(const item of financials.docs){const data=item.data();records.set(item.id,data);if(data.receiptLegacyPath||(data.receiptPath&&!data.receiptPath.startsWith('financial-files/'))||(!data.receiptPath&&data.receiptURL))pendingReceipts++}
  // Historical value notes were previously visible to crew too.
  const history=await getDocs(collection(db,'history'));
  for(const item of history.docs)if(/insurance|replacement cost|purchase|retailer|warranty|receipt|paid/i.test(item.data().action||'')){const batch=writeBatch(db);batch.set(doc(db,'financialHistory',item.id),item.data());batch.delete(item.ref);await batch.commit()}
  return {pendingReceipts};
 }
 return {records,prepare,transaction,set:(r,d,o)=>write('set',r,d,o),update:(r,d)=>write('update',r,d)};
}
