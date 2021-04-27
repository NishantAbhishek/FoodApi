const express = require("express");
const http = require("http");
const settings = require("../FoodApi/core/settings");
const signin = require("../FoodApi/controller/signin");
const jwt = require("jsonwebtoken");
const app = express();

app.listen(settings.port,()=>{
    console.log(settings.port);
});

app.post('/user/signIn',(req,resp)=>{
    var reqBody = '';
    req.on("data",function(data){
        reqBody+=data;
        console.log(reqBody);
        //req.query
        if(reqBody.length>1e7){
            //todo requst too large
        }                    
    });
    req.on("end",function(){      
        console.log(reqBody);
        signin.sendEmailVerification(req,resp,reqBody);
    });
});


app.post('/user/authenticate',(req,resp)=>{
    var reqBody = '';
    req.on("data",function(data){
        reqBody+=data;
        console.log(reqBody);
        //req.query
        if(reqBody.length>1e7){
            //todo requst too large
        }
    });

    req.on("end",function(){
        console.log(reqBody);
        signin.autheticateUser(req,resp,reqBody);
    });

});

// app.listen(5000,()=>{
//     console.log("5000");
// });

app.get('/api',(req,resp)=>{
    console.log(req.query);
    resp.json({
        message: "Welocome to the API"
    })
});

app.post('/api/posts',verifyToken,(req,resp)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        console.log(req.token);
        if(err){
            resp.sendStatus(403);
        }else{
            resp.writeHead(200,{"Content-Type":"application/json"});
            resp.write(JSON.stringify({
                StatusCode: 200,
                Status: "Success",
                authData
            }));     
            resp.end();
            // resp.json({
            //     message:"Post created....",
            //     authData
            // });
        }
    });
});

app.post('/api/login',(req,resp)=>{
    const user = {
        email:'nishant2548@gmail.com',
        name: 'Nishant Abhishek',
        password: '1234'
    }

    jwt.sign({user:user},'secretkey',(err,token)=>{
        resp.json({
            token
        })
    })
})

function verifyToken(req,resp,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const header = bearerHeader.split(' ');
        const bearertoken = header[1];
        req.token = bearertoken;
        console.log(bearerHeader);
        next();
    }else{
        //forbiden
        resp.sendStatus(403);
    }
}

