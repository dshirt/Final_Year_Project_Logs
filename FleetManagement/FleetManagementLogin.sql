#create DATABASE IF NOT EXISTS fleetLogin;
USE fleetLogin
;


create TABLE if NOT EXISTS loginDetails (
	personID int NOT NULL AUTO_INCREMENT,
	userName varchar (30) NOT NULL,
	userPassword varchar (30) NOT NULL,
	constraint pk_loginDetails primary key (personID)
) 
;

INSERT INTO loginDetails VALUES (1,"John Lawless", "password2020")
;
