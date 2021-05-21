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
const Stream = require("stream");
const fs = require("fs");
const profile = require("../FoodApi/controller/profile");
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

app.post("/profile/updateProfile",(req,resp)=>{
    var name = req.query.name;
    var userId = req.query.userId;
    var imageUrl = req.query.imageUrl;
    profile.UpdateProfile(req,resp,name,userId,imageUrl);
});

app.post("/profile/getUserInfo",(req,resp)=>{
    var userId = req.query.userId;
    profile.GetUserInfo(req,resp,userId);
});


app.post('/user/login',(req,resp)=>{
    var reqBody = '';
    req.on("data",function(data){
        reqBody+=data;
        //req.query
        if(reqBody.length>1e7){
            //todo requst too large
        }
    });
    req.on("end",function(){
        console.log(reqBody);
        login.checkEmailPassword(req,resp,reqBody);
    });
});

app.use("/profileImages",express.static('./profileImages'));

app.post("/user/profilePic",function(req,resp,next){
    console.log(req.files);
    const file = req.files.photo;
    const fileName = req.query.fileName;
    file.mv("./profileImages/"+fileName,function(err){
        if(err){
            throw err;
        }else{
            resp.send({
                StatusCode: 200,
                Status: "Success",
                Message:"File Uploaded"
            });
        }

    });
});


app.get('/image',(req,resp)=>{
    console.log("--");
    resp.sendFile(__dirname,'/image')
});


// app.listen(5000,()=>{
//     console.log("5000");
// });

// app.post('/user/auth/bookings',verifyToken,(req,resp)=>{
//     jwt.verify(req.token,'secretkey',(err,authData)=>{
//         console.log(req.token);
//         if(err){
//             message.failure200(req,resp,"Wrong Auth","");
//         }else{
//             console.log(authData.user);
//             book.getBookedRestaurant(req,resp,authData.user);
//         }
//     }); 
// });


app.post('/user/bookings',(req,resp)=>{
    console.log("All Data");
    var userId = req.query.userId;
    book.getBookedRestaurant(req,resp,userId);
});



app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.send(200);
    }else {
        next();
    }
    
});


app.post('/user/auth/bookRestaurant',verifyToken,(req,resp)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            console.log("Wrong auth")
            message.failure200(req,resp,"Wrong Auth","");
        }else{
            console.log("Right auth");
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
                console.log("Auth Data:- "+authData);
                console.log("ReqBody:-"+reqBody);
                book.BookRestaurant(req,resp,reqBody,authData.user);
            });
        }
    });
});

app.post('/user/bookRestaurant',(req,resp)=>{
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
        book.BookRestaurant(req,resp,reqBody);
    });
});

app.delete('/user/deleteBooked',(req,resp)=>{
    var userId = req.query.userId;
    var bookingId = req.query.bookingId;
    book.RemoveBooking(req,resp,userId,bookingId);
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

app.post('/restaurant/restaurantId',(req,resp)=>{
    var id = req.query.id;
    restaurant.getRestaurantWithId(req,resp,id);
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

app.post('/restaurant/search',(req,resp)=>{
    var value = req.query.value;
    restaurant.searchRestraunt(req,resp,value);
});



