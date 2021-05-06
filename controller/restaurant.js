const e = require("express");
var db = require("../core/db");
var message = require("../message");

exports.getRestaurantList = function(req,resp,page,limit){
    //SELECT * FROM RestaurantDetail ORDER BY Name OFFSET 4 ROWS FETCH NEXT 6 ROWS ONLY;
    var offset = page * limit;
    var next = limit;
    var restaurantQuery = "SELECT * FROM RestaurantDetail ORDER BY Name OFFSET "+
    offset+" ROWS FETCH NEXT "+next+" ROWS ONLY";
    console.log(restaurantQuery);
    db.executeSQl(restaurantQuery,function(data,err){
        if(!err){
            message.success200(req,resp,"Success",data.recordset);
        }else{
            message.success200(req,resp,"Failure","Sorry");
        }
    });    
}

exports.getTopRated = function(req,resp,page,limit){
    var offset = page * limit;
    var next = limit;
    var restaurantQuery = "SELECT * FROM RestaurantDetail WHERE Rating = 4 or Rating = 5  ORDER BY Rating DESC OFFSET "+
    offset+" ROWS FETCH NEXT "+next+" ROWS ONLY";

    db.executeSQl(restaurantQuery,function(data,err){
        if(!err){
            message.success200(req,resp,"Success",data.recordset);
        }else{
            message.success200(req,resp,"Failure","Sorry");
        }
    });
}

exports.getLowPriceRestaurant = function(req,resp,page,limit){
    var offset = page * limit;
    var next = limit;

    var restaurantQuery = "SELECT * FROM RestaurantDetail WHERE Pricy = 'Low' ORDER BY Rating DESC OFFSET "+
    offset+" ROWS FETCH NEXT "+next+" ROWS ONLY";

    db.executeSQl(restaurantQuery,function(data,err){
        if(!err){
            message.success200(req,resp,"Success",data.recordset);
        }else{
            message.success200(req,resp,"Failure","Sorry");
        }
    });

}


exports.getHighPriceRestaurant = function(req,resp,page,limit){
    var offset = page * limit;
    var next = limit;

    var restaurantQuery = "SELECT * FROM RestaurantDetail WHERE Pricy = 'High' ORDER BY Rating DESC OFFSET "+
    offset+" ROWS FETCH NEXT "+next+" ROWS ONLY";

    db.executeSQl(restaurantQuery,function(data,err){
        if(!err){
            message.success200(req,resp,"Success",data.recordset);
        }else{
            message.success200(req,resp,"Failure","Sorry");
        }
    });
    
}


