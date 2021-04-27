CREATE TABLE UserTable(
    UserId int IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Verified BIT,
    Subscription VARCHAR(255)
);
ALTER TABLE UserTable ADD CONSTRAINT Email UNIQUE 
ALTER TABLE UserTable ADD Password VARCHAR(255) NOT NULL
ALTER TABLE UserTable ADD VerificationCode VARCHAR(255)

INSERT INTO UserTable(FirstName,LastName,Email,Verified,Subscription,VerificationCode) VALUES('Satyam','Teji','Satu@gmail.com',0,'Basic',1242);

UPDATE UserTable SET Verified = 1 WHERE UserId = 1;
TRUNCATE TABLE UserTable;
SELECT * FROM UserTable;


-- UPDATE STUDENT SET FirstName = 'Nitin' WHERE  StudentId = 1

UPDATE UserTable Set Subscription = 1 WHERE Email = 'Satu@gmail.com' and VerificationCode  = '1242';

DELETE UserTable WHERE UserId = 1;

SELECT * FROM UserTable WHERE Email = 'nishant2548@gmail.com'
