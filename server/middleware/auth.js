import jwt  from "jsonwebtoken";

export const verifytoken=async(req,res,next)=>{
    try{
        //here in the header of authorization token will be set so that we can grab from there
        let token=req.headers.authorization || req.body.headers.Authorization;

        if(!token){
            console.log(req.body)
         return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token=token.slice(7,token.length).trimLeft();
        }
        // console.log("Hey ",token);
        console.log("******************")
        console.log(req.body)
        console.log("******************")
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    } catch(err){
        console.log(err.message)
        res.status(500).json({error:err.message});
    }
}
