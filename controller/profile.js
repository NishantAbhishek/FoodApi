var db = require("../core/db");
var message = require("../message");

exports.UpdateProfile = function(req,resp,name,userId,userImage){
    var query ="UPDATE UserTable  SET FirstName = '"+name+"' , ImageUrl = '"+userImage+"' WHERE Userid = "+userId;
    console.log(query);
    db.executeSQl(query,function(data,err){
        if(!err){
            message.success200(req,resp,"Success Updating","");
        }else{
            message.success200(req,resp,"Failure Updating","");            
        }
    });
}

exports.GetUserInfo = function(req,resp,userId){
    var query = "SELECT * FROM UserTable WHERE UserId = "+userId;
    console.log(query);
    db.executeSQl(query,function(data,err){
        if(!err){
            console.log(data.recordset);
            message.success200(req,resp,"Success",data.recordset);
        }else{
            message.success200(req,resp,"Failure","");
        }
    });
}
