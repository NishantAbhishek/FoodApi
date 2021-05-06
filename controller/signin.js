var db = require("../core/db");
var util = require("util");
var nodeMailer = require("nodemailer");
exports.sendEmailVerification = function(req,resp,reqBody){
    try{
        if(!reqBody){
            throw new Error("Input Not Valid");
        }
        //first check if email is already prensent or not
        //if present then check verified, if verified then dont allow
        //if not verified send the verification code again
        //if email not presnet send the data to databse and send a request        
        var req_data = JSON.parse(reqBody);
        var email = req_data.Email;
        var getDataQuery = "SELECT * FROM UserTable WHERE EMAIL = '"+email+"'";
        console.log(getDataQuery);
        db.executeSQl(getDataQuery,function(emailCheck_data,err){
            if(err){
                console.log(err);
                resp.writeHead(200,{"Content-Type":"application/json"});
                resp.write(JSON.stringify({
                    StatusCode: 200,
                    Status: "Failure",
                    Message: "Not Success"
                }));
                resp.end();
            }else{
                if(emailCheck_data.recordset.length==0){
                    var key =  makeString(4);                 
                    var query = "INSERT INTO UserTable(FirstName,LastName,Email,Verified,Password,VerificationCode,Subscription) VALUES(";
                    query = query+"'"+req_data.FirstName+"',";
                    query = query+"'"+req_data.LastName+"',";
                    query = query+"'"+req_data.Email+"',";
                    query = query+"'"+req_data.Verified+"',";
                    query = query+"'"+req_data.Password+"',";
                    query = query+"'"+key+"',";
                    query = query+"'"+req_data.Subscription+"')";
                    console.log(query);

                    db.executeSQl(query,function(insert_data,err){
                        if(err){
                            resp.writeHead(200,{"Content-Type":"application/json"});
                            resp.write(JSON.stringify({
                                StatusCode: 200,
                                Status: "Failure",
                                Message: "Sql query problem"
                            }));      
                            resp.end();   
                        }else{
                            sendVerifcation(email,key,function(data,err){
                                if(err){
                                    if(data.recordset[0].Verified===1){
                                        resp.writeHead(200,{"Content-Type":"application/json"});
                                        resp.write(JSON.stringify({
                                            StatusCode: 200,
                                            Status: "Failure",
                                            Message: "Send verifiaction code problem"
                                        }));      
                                        resp.end();           
                                    }              
                                }else{
                                    console.log("Success executing sql");
                                    resp.writeHead(200,{"Content-Type":"application/json"});
                                    resp.write(JSON.stringify({
                                        StatusCode: 200,
                                        Status: "Success",
                                        Message: "Verification Mail Sent"
                                    }));
                                    resp.end();
                                }
                            });
                        }
                    });

                }else{
                    console.log(emailCheck_data.recordset);
                    if(emailCheck_data.recordset[0].Verified===1||emailCheck_data.recordset[0].Verified===true){
                        console.log("data present and verified");
                        resp.writeHead(200,{"Content-Type":"application/json"});
                        resp.write(JSON.stringify({
                            StatusCode: 200,
                            Status: "Failure",
                            Message: "Email Already used"
                        }));      
                        resp.end();
                    }else{
                        console.log("data present but not verified");
                        var key_ = emailCheck_data.recordset[0].VerificationCode;
                        sendVerifcation(email,key_,function(verification,err){
                            if(err){
                                resp.writeHead(200,{"Content-Type":"application/json"});
                                resp.write(JSON.stringify({
                                    StatusCode: 200,
                                    Status: "Success",
                                    Message: "Problem Occured"
                                }));          
                                resp.end();                                
                            }else{
                                console.log("Verification mail sent");
                                resp.writeHead(200,{"Content-Type":"application/json"});
                                resp.write(JSON.stringify({
                                    StatusCode: 200,
                                    Status: "Success",
                                    Message: "Verification Mail Sent"
                                }));          
                                resp.end();                   
                            }
                        });                        
                    }
                }
            }
        });
    }catch(err){
        console.log(err);
    }
}

function sendVerifcation(email,key,callback){
    var transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure: true,
        auth:{
            user:"nishantkumarpj@gmail.com",
            pass:"malamani"
        }          
    });

    var mailOptions={
        from:"nishantkumarpj@gmail.com",
        to: email,
        subject:"Email Verification",
        text:"Your verification key is "+key
    }

    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err);
            callback(null,err);
        }else{
            console.log(info);
            callback(info);
        }
    });

}

exports.autheticateUser = function(req,resp,reqBody){
    try{
        if(!reqBody){
            throw new Error("Input not valid");
        }
        var data = JSON.parse(reqBody);
        var email = data.Email;
        var key = data.Key;

        var getDataQuery = "SELECT * FROM UserTable WHERE Email = '"+email+"'";
        console.log(getDataQuery);
        db.executeSQl(getDataQuery,function(data,err){
            if(err){
                console.log(err);
                resp.writeHead(500,{"Content-Type":"application/json"});
                resp.write(JSON.stringify({
                    StatusCode: 500,
                    Status: "Failure",
                    Message: "Not Success"
                }));
            }else{
                console.log(data);
                if(data.recordset.length==1){
                    if(data.recordset[0].VerificationCode===key){
                        console.log(data.recordset[0].FirstName);
                        var query = "UPDATE UserTable Set Verified = 1 WHERE Email = ";
                        query += "'"+email+"' and VerificationCode = '"+key+"'";
                        console.log(query);
                        db.executeSQl(query,function(data,err){
                            if(err){
                                console.log(err);
                                resp.writeHead(500,{"Content-Type":"application/json"});
                                resp.write(JSON.stringify({
                                    StatusCode: 500,
                                    Status: "Failure",
                                    Message: "Not Success"
                                }));
                            }else{
                                console.log("--ResponseComplete--")
                                resp.writeHead(200,{"Content-Type":"application/json"});
                                resp.write(JSON.stringify({
                                    StatusCode: 200,
                                    Status: "Success",
                                    Message: "Authentication Confirmed"
                                }));
                            }
                            resp.end();
                        });
                    }else{
                        console.log("Erro-----");
                        resp.writeHead(200,{"Content-Type":"application/json"});
                        resp.write(JSON.stringify({
                            StatusCode: 200,
                            Status: "Failure",
                            Message: "Wrong Code"
                        }));
                        resp.end();
                    }
                }else{
                    resp.writeHead(500,{"Content-Type":"application/json"});
                    resp.write(JSON.stringify({
                        StatusCode: 500,
                        Status: "Failure",
                        Message: "Not Success"
                    }));
                    resp.end();
                }

            }
        });


    }catch(ex){
        console.log(ex);
    }

}

function makeString(length){
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for(var i = 0;i<length;i++){
        result.push(characters.charAt(Math.floor(Math.random()*charactersLength)));
    }
    return result.join('');
}