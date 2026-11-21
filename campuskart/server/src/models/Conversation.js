import mongoose from 'mongoose';
const schema=new mongoose.Schema({item:{type:mongoose.Schema.Types.ObjectId,ref:'Item',required:true},members:[{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}],messages:[{sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'},text:{type:String,maxlength:1000},createdAt:{type:Date,default:Date.now}}]},{timestamps:true});
export default mongoose.model('Conversation',schema);
