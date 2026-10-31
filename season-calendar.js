/* Pacific wall-calendar boundaries: all events change at 4:30 a.m., including DST. */
(()=>{'use strict';
function parts(date=new Date()){return Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,+p.value]))}
function day(date=new Date()){const p=parts(date);return new Date(Date.UTC(p.year,p.month-1,p.day)-(p.hour*60+p.minute<270?86400000:0))}
function week(date=new Date()){const d=day(date);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10)}
function season(date=new Date()){const d=day(date),s=d.toISOString().slice(0,10);let name='none',stage='none',label='',icon='',week=0;
 if(s>='2026-10-01'&&s<'2026-11-02'){name='halloween';stage=s<'2026-10-15'?'subtle':s<'2026-10-26'?'building':'full';label='Halloween';icon='🎃'}
 if(s>='2026-11-30'&&s<'2027-01-10'){name='christmas';label='Christmas';icon='🎄';week=s<'2026-12-07'?1:s<'2026-12-14'?2:s<'2026-12-21'?3:4;stage=week===1?'subtle':week===2?'building':'full';if(s>='2026-12-30'&&s<'2027-01-03'){stage='newyear';label='Happy New Year';icon='✨'}}
 return{name,stage,label,icon,week};}
window.TTCalendar={parts,day,week,season};
})();
