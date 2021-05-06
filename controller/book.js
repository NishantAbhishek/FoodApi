var db = require("../core/db");
var message = require("../message")

exports.BookRestaurant = function(req,resp,reqBody,userBody){
    try{
        if(!reqBody){
            throw new Error("Input Not Valid");
        }
        var req_data = JSON.parse(reqBody);
        var Userid = userBody.UserId;
        var RestauruntId = reqBody.RestaurantId;
        var NumberOfTable = reqBody.NumberOfTable;
        var DateBooked = reqBody.DateBooked;
        var TimeBooked = reqBody.TimeBooked;

        var bookQuery = "INSERT INTO UserBooking(Userid,RestauruntId,NumberOfTable,DateBooked,TimeBooked) VALUES";
        bookQuery = bookQuery + "('"+Userid+"'"+ "'"+RestauruntId+"'"+ "'"+NumberOfTable+"'" +"'"+DateBooked+"'" +"'"+TimeBooked+"')";

        console.log(bookQuery);
        db.executeSQl(bookQuery,function(data,err){
            if(!err){
                message.success200(req,resp,"Success Booking","");
            }else{
                message.failure200(req,resp,"Booking Failure","");
            }
        });

    }catch(err){
        console.log(err);
    }
}

exports.getBookedRestaurant = function(req,resp,userBody){
    try{
        if(!userBody){
            throw new Error("Input Not Valid");
        }

        var Userid = userBody.UserId;
        var getBookedQuery = "SELECT * FROM UserBooking WHERE UserId = " + Userid;
        console.log(getBookedQuery);
        db.executeSQl(getBookedQuery,function(bookedRestaurant,err){
            if(!err){
                console.log(bookedRestaurant);
                if(bookedRestaurant.recordset.length>0){
                    var restroDetailQ = "SELECT NAME ,Rating, ImageUrl, RestaurantType FROM RestaurantDetail WHERE ";                    
                    for(var i = 0;i<bookedRestaurant.recordset.length;i++){
                        restroDetailQ+="RestaurantId = '"+bookedRestaurant.recordset[i].RestauruntId+"' or ";                       
                    }                    
                    restroDetailQ = restroDetailQ.slice(0,-3);
                    console.log(restroDetailQ);
                    db.executeSQl(restroDetailQ,function(restaurant,err){
                        if(!err){
                            console.log(restaurant);
                            console.log("-- "+bookedRestaurant.recordset[0].BookingId);

                            var data=[];
                            for(var i = 0;i<restaurant.recordset.length;i++){
                                var responseData=
                                {
                                    BookingId :bookedRestaurant.recordset[i].BookingId,
                                    Userid :bookedRestaurant.recordset[i].Userid,
                                    RestauruntId :bookedRestaurant.recordset[i].RestauruntId,
                                    NumberOfTable :bookedRestaurant.recordset[i].NumberOfTable,
                                    DateBooked :bookedRestaurant.recordset[i].DateBooked,
                                    TimeBooked :bookedRestaurant.recordset[i].TimeBooked,

                                    RestaurantName :restaurant.recordset[i].NAME,
                                    Rating : restaurant.recordset[i].Rating,
                                    ImageUrl :restaurant.recordset[i].ImageUrl,
                                    RestaurantType :restaurant.recordset[i].RestaurantType
                                }
                                data.push(responseData);

                            }
                            console.log(data);
                            message.sendJson(req,resp,"Success",data);
                            
                        }else{
                            message.failure200(req,resp,"List Failure",[]);
                        }
                    });

                }else{
                    message.success200(req,resp,"No Booking Found",[]);
                }
            }else{
                message.failure200(req,resp,"List Failure",[]);
            }
        })


    }catch(err){
        console.log(err);
    }
}



