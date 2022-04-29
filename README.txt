create database eventdata;
use eventdata;
create table registeredUsers(
	user varchar(255), 
	pass varchar(255)

);
create table userdata(
	username varchar(255),
	userevents JSON
)