import mongoose from 'mongoose';
const schema=new mongoose.Schema({item:{type:mongoose.Schema.Types.ObjectId,ref:'Item',required:true},requester:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},type:{type:String,enum:['exchange','claim','buy'],required:true},offeredItem:{type:mongoose.Schema.Types.ObjectId,ref:'Item'},note:{type:String,maxlength:500},status:{type:String,enum:['pending','accepted','rejected','completed','cancelled'],default:'pending'}},{timestamps:true});
export default mongoose.model('Request',schema);
