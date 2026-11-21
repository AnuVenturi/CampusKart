import mongoose from 'mongoose';
const schema=new mongoose.Schema({reporter:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},item:{type:mongoose.Schema.Types.ObjectId,ref:'Item',required:true},reason:{type:String,required:true,maxlength:600},status:{type:String,enum:['open','resolved'],default:'open'}},{timestamps:true});
export default mongoose.model('Report',schema);
