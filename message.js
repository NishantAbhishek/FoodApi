exports.failure200 = function(req,resp,message,data_){
    resp.writeHead(200,{"Content-Type":"application/json"});
    resp.write(JSON.stringify({
        StatusCode: 200,
        Status: "Failure",
        Message: message,
        data: data_
    }));
    resp.end();
}

exports.success200 = function(req,resp,message,data_){
    resp.writeHead(200,{"Content-Type":"application/json"});
    resp.write(JSON.stringify({
        StatusCode: 200,
        Status: "Success",
        Message: message,
        data: data_
    }));
    resp.end();
}

exports.sendJson = function(req,resp,message,data_){
    resp.writeHead(200,{"Content-Type":"application/json"});
    resp.write(JSON.stringify({
        StatusCode: 200,
        Status: "Success",
        Message: message,
        data: data_
    }));
    resp.end();
}