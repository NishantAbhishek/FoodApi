var sqlDb = require("mssql");
var settings = require("../core/settings");

exports.executeSQl =  function(sql,callback){
    console.log("Execute Sql Called");
    //CoonectionPool 
    var conn = new sqlDb.ConnectionPool(settings.dbConfig);
    conn.connect().then(function(){
        //after it is connected to database server
        var req = new sqlDb.Request(conn);
        req.query(sql).then(function(recordSet){ 
            console.log("Query success");
            callback(recordSet);
        }).catch(function(err){
            console.log("Error:- "+err);
            callback(null,err);
        });
    }).catch(function(err){
        console.log("Error:- "+err);
        callback(null,err);
    });
}