var db =  require("../core/db");
var util = require("util");
var nodeMailer = require("nodemailer");

exports.sendEmailVerification = function(req,resp,reqBody){
    try{
        if(!reqBody){
            throw new Error("Input Not Valid");
        }
        var data = JSON.parse(reqBody);
        var key = makeString(5);
        //transporter
        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth:{
                user:"nishantkumarpj@gmail.com",
                pass:"malamani"
            }     
        });
        //body mail
        var mailOptions={
            from:"nishantkumarpj@gmail.com",
            to: data.Email,
            subject:"Email Verification",
            text:"Your verification key is "+key
        }

        var query = "INSERT INTO UserTable(FirstName,LastName,Email,Verified,Password,VerificationCode,Subscription) VALUES(";
        query = query+"'"+data.FirstName+"',";
        query = query+"'"+data.LastName+"',";
        query = query+"'"+data.Email+"',";
        query = query+"'"+data.Verified+"',";
        query = query+"'"+data.Password+"',";
        query = query+"'"+key+"',";
        query = query+"'"+data.Subscription+"')";
        console.log(query);
        //send email
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err);            
            }else{
                //after the mail is sent execute this
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
                        console.log("Success executing sql");
                        resp.writeHead(200,{"Content-Type":"application/json"});
                        resp.write(JSON.stringify({
                            StatusCode: 200,
                            Status: "Success",
                            Message: "Verification Mail Sent"
                        }));                
                    }
                    resp.end();
                });                
            }
        });

    }catch(ex){
        console.log(ex);
    }
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
                                resp.writeHead(500,{"Content-Type":"application/json"});
                                resp.write(JSON.stringify({
                                    StatusCode: 200,
                                    Status: "Success",
                                    Message: "Authentication Confirmed"
                                }));
                            }
                            resp.end();
                        });
                    }else{
                        resp.writeHead(500,{"Content-Type":"application/json"});
                        resp.write(JSON.stringify({
                            StatusCode: 500,
                            Status: "Failure",
                            Message: "Not Success"
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
    for(var i = 1;i<length;i++){
        result.push(characters.charAt(Math.floor(Math.random()*charactersLength)));
    }
    return result.join('');
}