const express = require('express');
const app = express();
require('./dbconn');
const client = require('./rediClient');
const router = require('./routes');

const max_second=60;
const max_request=10;
const rateLimit =async(req,res,next)=>{
    const ipAddress=req.ip;
    const currentTime=Math.floor(Date.now()/1000);
    const requestCount=await client.get(`rate_limit:${ipAddress}`);
    if(requestCount){
        if(parseInt(requestCount)>=max_request){
            res.status(429).json({message:"Too many requests, please try again later"});
        }else{
            await client.incr(`rate_limit:${ipAddress}`);
        }
    }else{
        await client.set(`rate_limit:${ipAddress}`,1,{EX:max_second});
    }
    next(); 
}

app.use(rateLimit);
app.use(express.json());

app.use('/api', router);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});