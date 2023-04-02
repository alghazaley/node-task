const {NotAuth}=require('../errorclasses/notauth')
const jwt =require('jsonwebtoken') 
const Auth=async(req,res,next)=>{
   
    if(req.headers.authentication||req.body.authentication){
        try{
            const authentication=req.headers.authentication?req.headers.authentication:req.body.authentication
            const payload= jwt.verify(authentication,process.env.JWT_KEY)
            req.currentUser=payload
          }catch(err){
            return next(new NotAuth('You are not authenticated')) 
          }
         
        return next()
    }
    if(!req.session?.jwt){
      return next(new NotAuth('You are not authenticated')) 
    }
    try{
      const payload= jwt.verify(req.session.jwt,process.env.JWT_KEY)
      req.currentUser=payload
    }catch(err){
       return next(new NotAuth('You are not authenticated')) 
    }
    
  return next()
    
}




module.exports={Auth}


