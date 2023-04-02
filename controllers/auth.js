const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')

module.exports={
    signup:async(req,res)=>{
        try{
            const {name,email,password,mobile}=req.body;
            const exists=await user.findOne({email})
            if(exists){
                throw new BadReqErr('Email is already in use')
            }
           else{
            const User= await user.create({name,email,password:hashPass(password),mobile})
            return res.status(201).send({name:User.name,email:User.email,mobile:User.mobile,id:User._id,status:true})
           } 
        }catch(err){
            throw new BadReqErr(err.message)
        }
      
    },
    signin:async(req,res)=>{
        try{
            const {email,password}=req.body;
            //if user exist
        
            const existingUser=await user.findOne({email})
            if(!existingUser){
                throw new BadReqErr('invalid creds can not find user ')
            }
        
            //check password
            const validate=comparePass(password,existingUser.password)
            if(!validate){
                throw new BadReqErr('invalid creds  error in password')
            }
        
            //send jwt 
            const token= jwt.sign({
                id:existingUser._id,
            },process.env.JWT_KEY)
            req.session={
                jwt:token
            }
            console.log(existingUser)
            //send data
            res.status(200).send({
                name:existingUser.name,
                email:existingUser.email,
                mobile:existingUser.mobile,
                status:true,
                id:existingUser._id,
                token
            })
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    signout:async(req,res)=>{
        try{
            req.session=null
            res.send({
                token:null,
                currentUser:null,
            })
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    current:async(req,res)=>{
        //check first is the session object exist and then check jwt
        if(req.currentUser){
          try{
            const {name,email,_id,mobile}= await user.findById(req.currentUser.id)
            return res.send({
                name,
                email,
                mobile:mobile?mobile:"there is no mobile for this user",
                id:_id,
                status:true,
            })
          }catch(err){
            throw new notfound('this user can not be found')
          }
         
        }
        return res.send({currentUser:null})
    },
}