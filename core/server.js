
// exports.serve = function(){
//     http.createServer(function(req,resp){
//         console.log(req.url+" "+req.method);
//         switch(req.method){
//             case "POST":
//                 console.log("POST CALLED"+req.query);
//                 if(req.url==="/user/signIn"){
//                     var reqBody = '';
//                     req.on("data",function(data){
//                         reqBody+=data;
//                         console.log(reqBody);
//                         //req.query
//                         if(reqBody.length>1e7){
//                             //todo requst too large
//                         }                    
//                     });

//                     req.on("end",function(){      
//                         console.log(reqBody);
//                         signin.sendEmailVerification(req,resp,reqBody);
//                     });
//                 }else if(req.url==="/user/authenticate"){
//                     var reqBody = '';
//                     req.on("data",function(data){
//                         reqBody = reqBody+data;
//                         if(reqBody.length>1e7){
//                             //todo requst too large
//                         }
//                     });
//                     req.on("end",function(){
//                         console.log(reqBody);
//                         signin.autheticateUser(req,resp,reqBody);
//                     })
//                 }
//                 break;

//             // case "GET":
//             //     console.log(req.query+"GET REQUEST "+req.url);
//             //     if(req.url==="/api"){
//             //         resp.json({
//             //             message: "Welcome to the API"
//             //         });
//             //     }
//         }                
//     }).listen(settings.port,function(){
//         console.log("Server started on node "+settings.port);
//     });
// }
