import Notification from '../models/Notification.js';
export async function notify(io,user,text,item){const n=await Notification.create({user,text,item});io.to('user:'+user.toString()).emit('notification',n);return n}
