const express = require("express");
const http = require("http");
const settings = require("../core/settings");
const login = require("../controller/login");
exports.serve = function(){
    http.createServer(function(req,resp){
        console.log(req.url+" "+req.method);
        switch(req.method){
            case "POST":
                if(req.url==="/user/login"){
                    var reqBody = '';
                    req.on("data",function(data){
                        reqBody+=data;
                        if(reqBody.length>1e7){
                            //todo requst too large
                        }                    
                    });

                    req.on("end",function(){
                        login.sendEmailVerification(req,resp,reqBody);
                    })
                }else if(req.url==="/user/authentcate"){
                    var reqBody = '';
                    req.on("data",function(data){
                        reqBody = reqBody+data;
                        if(reqBody.length>1e7){
                            //todo requst too large
                        }
                    });
                    req.on("end",function(){
                        console.log(reqBody);
                        login.autheticateUser(req,resp,reqBody);
                    })
                }
                break;

        }                
    }).listen(settings.port,function(){
        console.log("Server started on node "+settings.port);
    });
}
