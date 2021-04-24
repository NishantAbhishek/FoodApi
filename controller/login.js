var db =  require("../core/db");
var util = require("util");
var nodeMailer = require("nodemailer");

exports.sendEmailVerification = function(req,resp,reqBody){
    try{
        if(!reqBody){
            throw new Error("Input Not Valid");
        }
        var data = JSON.parse(reqBody);
        var query = "INSERT INTO UserTable(FirstName,LastName,Email,Verified,Subscription) VALUES(";
        query = query+"'"+data.FirstName+"',";
        query = query+"'"+data.LastName+"',";
        query = query+"'"+data.Email+"',";
        query = query+"'"+data.Verified+"',";
        query = query+"'"+data.Subscription+"')";
        console.log(query);
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
            text:"Follow the link to verify your account."
        }

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

