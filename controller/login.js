var db = require("../core/db");
const jwt = require("jsonwebtoken");
//check wether email and password and account is verified
//after meeting the condition creates a auth token and allow user to login
exports.checkEmailPassword = function(req,resp,reqBody){
    try{
        if(!reqBody){
            throw new Error("Input not Valid");            
        }
        var req_data = JSON.parse(reqBody);
        var email = req_data.Email;
        var password= req_data.Password;
        var verifyQuery = "SELECT * FROM UserTable WHERE Verified = 1 and Email = '"
        +email+"' and Password = '" +password+"'";
        console.log(verifyQuery);
        db.executeSQl(verifyQuery,function(verify_data,err){
            if(!err){        
                if(verify_data.recordset.length===1){
                    console.log(verify_data.recordset[0]);
                    const user = verify_data.recordset[0];
                    jwt.sign({user:user},'secretkey',(err,token)=>{
                        if(!err){
                            resp.writeHead(200,{"Content-Type":"application/json"});
                            resp.write(JSON.stringify({
                                StatusCode: 200,
                                Status: "Success",
                                Message: "Login Success",
                                auth:token,
                                Name: verify_data.recordset[0].FirstName+ " "+verify_data.recordset[0].LastName,
                                UserId:verify_data.recordset[0].UserId                            
                            }));      
                            resp.end(); 
                        }else{
                            console.log(err);
                            console.log(verify_data);
                            resp.writeHead(200,{"Content-Type":"application/json"});
                            resp.write(JSON.stringify({
                                StatusCode: 200,
                                Status: "Failure",
                                Message: "Login Failure",
                                auth:"",
                                Name: ""
                            }));      
                            resp.end();                            
                        }
                    });
                }else{
                    console.log(verify_data);
                    resp.writeHead(200,{"Content-Type":"application/json"});
                    resp.write(JSON.stringify({
                        StatusCode: 200,
                        Status: "Failure",
                        Message: "Login Failure",
                        auth:"",
                        Name: ""
                    }));      
                    resp.end();  
                }
            }else{
                console.log(err);
                resp.writeHead(200,{"Content-Type":"application/json"});
                resp.write(JSON.stringify({
                    StatusCode: 200,
                    Status: "Failure",
                    Message: "Login Failure",
                    auth:"",
                    Name:""
                }));      
                resp.end();  
            }
            console.log(verify_data);
        });
    }catch(err){
        console.log(err);
    }
}


