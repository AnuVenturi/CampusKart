import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function auth(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(!token)return res.status(401).json({error:'Authentication required'});const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.id);if(!user||user.suspended)return res.status(401).json({error:'Account unavailable'});req.user=user;next()}catch{return res.status(401).json({error:'Invalid or expired session'})}}
export function admin(req,res,next){if(req.user.role!=='admin')return res.status(403).json({error:'Admin access required'});next()}
