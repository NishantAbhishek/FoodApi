const express = require("express");
const http = require("http");
const settings = require("../core/settings");
const login = require("../controller/login");
exports.serve = function(){
    http.createServer(function(req,resp){
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
                        console.log(reqBody.FirstName);
                        login.sendEmailVerification(req,resp,reqBody);
                    })
                }
                break;

            case "GET":
                if(req.url==="/user/authenticate"){

                }
                break;
        }                
    }).listen(settings.port,function(){
        console.log("Server started on node "+settings.port);
    });
}
