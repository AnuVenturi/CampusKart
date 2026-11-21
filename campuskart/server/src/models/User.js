import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},passwordHash:{type:String,required:true},studentId:{type:String,trim:true},department:{type:String,trim:true},year:{type:Number,min:1,max:6},phone:{type:String,select:false},role:{type:String,enum:['student','admin'],default:'student'},verified:{type:Boolean,default:false},suspended:{type:Boolean,default:false},blocked:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:'Item'}]}, {timestamps:true});
schema.set('toJSON',{transform:(_doc,ret)=>{delete ret.passwordHash;delete ret.phone;return ret}});
export default mongoose.model('User',schema);
