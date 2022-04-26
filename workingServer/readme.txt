Note that the files in the example require a table called registeredUsers within the database CS2803

Use the following queries:

create database CS2803;
use CS2803;
create table registeredUsers(
    username varchar(60) primary key,
    password varchar(60) not null
)

Don't forget to use npm install to install all dependencies