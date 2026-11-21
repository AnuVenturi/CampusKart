import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},text:{type:String,required:true},item:{type:mongoose.Schema.Types.ObjectId,ref:'Item'},read:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.model('Notification',schema);
