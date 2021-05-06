const express = require("express");
const http = require("http");
const settings = require("../FoodApi/core/settings");
const signin = require("../FoodApi/controller/signin");
const jwt = require("jsonwebtoken");
const app = express();
const login = require("../FoodApi/controller/login");
const message = require("../FoodApi/message");
const book = require("../FoodApi/controller/book");
const fileupload = require('express-fileupload');
const restaurant = require("../FoodApi/controller/restaurant");

app.use(fileupload());

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

app.post('/user/login',(req,resp)=>{
    var reqBody = '';
    req.on("data",function(data){
        reqBody+=data;
        //req.query
        console.log(reqBody);
        if(reqBody.length>1e7){
            //todo requst too large
        }
    });
    req.on("end",function(){
        login.checkEmailPassword(req,resp,reqBody);
    });
});

app.post("/user/upload",function(req,resp,next){
    console.log(req.files);
    const file = req.files.photo;
    file.mv("./uploads/"+file.name,function(err){
        if(err){
            throw err;
        }else{
            resp.send({
                success: true,
                message: "File Upload!"
            });
        }

    });

})

// app.listen(5000,()=>{
//     console.log("5000");
// });

app.post('/user/bookings',verifyToken,(req,resp)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        console.log(req.token);
        if(err){
            message.failure200(req,resp,"Wrong Auth","");
        }else{
            console.log(authData.user);
            book.getBookedRestaurant(req,resp,authData.user);
        }
    });
});




app.post('/user/getRestaurant',(req,resp)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            message.failure200(req,resp,"Wrong Auth","");
        }else{
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
                console.log("Auth Data:- "+authData);
                console.log("ReqBody:-"+reqBody);
                book.BookRestaurant(req,resp,reqBody,authData.user);
            });
        }
    });
});

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


app.post('/restaurant/getRestaurant',(req,resp)=>{
    var page = req.query.page;
    var limit = req.query.limit;
    restaurant.getRestaurantList(req,resp,page,limit);
});

app.post('/restaurant/topRated',(req,resp)=>{
    console.log(req.query);
    var page = req.query.page;
    var limit = req.query.limit;
    restaurant.getTopRated(req,resp,page,limit);
});

app.post('/restaurant/lowPrice',(req,resp)=>{
    var page = req.query.page;
    var limit = req.query.limit;
    restaurant.getLowPriceRestaurant(req,resp,page,limit);
});

app.post('/restaurant/highPrice',(req,resp)=>{
    var page = req.query.page;
    var limit = req.query.limit;
    restaurant.getHighPriceRestaurant(req,resp,page,limit);
});

