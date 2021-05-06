CREATE TABLE UserTable(
    UserId int IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Verified BIT,
    Subscription VARCHAR(255)
);

CREATE TABLE RestaurantDetail(
    RestaurantId int IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Rating INT NOT NULL,
    Lat FLOAT NOT NULL,
    Lang FLOAT NOT NULL,
    Pricy VARCHAR(255) NOT NULL,
    ImageUrl VARCHAR(255),
    RestaurantType VARCHAR(255),
    PureVeg BINARY,
    Annoucement VARCHAR(255),
    AnnoucementDate VARCHAR(255),
    UpcomingEvent VARCHAR(255),
    EventDate VARCHAR(255)
);

CREATE TABLE RestaurantImage(
    ImageId int IDENTITY(1,1) PRIMARY KEY,
    RestaurantId int NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL
);



CREATE TABLE UserBooking(
    BookingId INT IDENTITY(1,1) PRIMARY KEY,
    Userid INT NOT NULL,
    RestauruntId INT NOT NULL,
    NumberOfTable INT NOT NULL,
    DateBooked VARCHAR(255) NOT NULL,
    TimeBooked VARCHAR(255) NOT NULL
);

ALTER TABLE UserTable ADD ImageUrl VARCHAR(255)



ALTER TABLE UserTable ADD CONSTRAINT Email UNIQUE 
ALTER TABLE UserTable ADD Password VARCHAR(255) NOT NULL
ALTER TABLE UserTable ADD VerificationCode VARCHAR(255)

INSERT INTO UserTable(FirstName,LastName,Email,Verified,Subscription,VerificationCode) VALUES('Satyam','Teji','Satu@gmail.com',0,'Basic',1242);

UPDATE UserTable SET Verified = 1 WHERE UserId = 1;
TRUNCATE TABLE UserTable;
SELECT * FROM UserTable;

SELECT * FROM UserTable WHERE Verified = 1 and Email = 'Nishant2548@gmail.com' and Password  = '123456789'


-- UPDATE STUDENT SET FirstName = 'Nitin' WHERE  StudentId = 1

UPDATE UserTable Set Subscription = 1 WHERE Email = 'Satu@gmail.com' and VerificationCode  = '1242';

DELETE UserTable WHERE UserId = 2;

SELECT * FROM UserTable WHERE Email = 'nishant2548@gmail.com'


--Inserting into RestaurantDetail
INSERT INTO RestaurantDetail(Name,Rating,Lat,Lang,Pricy,ImageUrl,RestaurantType,PureVeg,Annoucement,AnnoucementDate,UpcomingEvent,EventDate) VALUES
('Apte Ka Chola',3,23.2,24.8,'LOW','','Chola',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021',NULL,NULL),
('Masal Dosha',5,23.2,24.8,'HIGH','','Dosha',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021','Anuual Ceremony','29/05/2021'),
('Pizza Hut',5,23.2,24.8,'LOW','','Pizza',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021','Monthly Bumper GiveAway','1/05/2021'),
('Lucknow Rstaurant',3,23.2,24.8,'LOW','','Restaurant',1,'Will Not Open after 4 PM Due to Covid Situation, thus party function event will be cancelled','24/05/2021',NULL,NULL),
('Apte Ka Chola',3,23.2,24.8,'LOW','','Chola',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021',NULL,NULL),
('Food Corner',5,23.2,24.8,'HIGH','','Dosha',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021','Anuual Ceremony','29/05/2021'),
('Food Hut',3,23.2,24.8,'LOW','','Pizza',1,'Will Not Open after 4 PM Due to Covid Situation','24/05/2021','Yearly Bumper GiveAway','1/05/2021'),
('Memoir Rstaurant',5,23.2,24.8,'High','','Restaurant',1,'Will Not Open after 4 PM Due to Covid Situation, thus party function event will be cancelled','24/05/2021',NULL,NULL)

Select * FROM RestaurantDetail;

--Inserting into UserBooking
INSERT INTO UserBooking(Userid,RestauruntId,NumberOfTable,DateBooked,TimeBooked) VALUES
(5,3,5,'28/05/2003/','3:30 AM'),
(5,2,5,'29/05/2003/','3:30 AM'),
(5,1,5,'30/05/2003/','3:30 AM');


--Getting UserBooking User and Restaurant Detail
SELECT * FROM UserBooking WHERE Userid = 5;

SELECT NAME ,Rating, ImageUrl, RestaurantType FROM RestaurantDetail WHERE RestaurantId = '1' or RestaurantId = '3'




SELECT * FROM UserBooking;


SELECT * FROM RestaurantDetail ORDER BY Name;
SELECT * FROM UserTable;

SELECT * FROM RestaurantDetail ORDER BY Name OFFSET 2 ROW

-- offest will be page * numberOfItem
SELECT * FROM RestaurantDetail ORDER BY Name OFFSET 4 ROWS FETCH NEXT 6 ROWS ONLY;

SELECT * FROM RestaurantDetail WHERE Rating = 3 or Rating = 4 or Rating = 5  ORDER BY Rating DESC OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;


SELECT * FROM RestaurantDetail WHERE Rating = 3 or Rating = 4 or Rating = 5  ORDER BY Rating DESC OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;



