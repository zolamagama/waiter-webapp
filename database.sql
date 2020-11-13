create table weekdays (

	id serial not null primary key,
	days text not null

);

create table waiters (

id serial not null primary key,
waiter_name text not null

);

create table estratweni (

id serial not null primary key,
waiters_id int not null,
foreign key (waiters_id) references waiters(id),
weekdays_id int not null,
foreign key (weekdays_id) references weekdays(id)

);



insert into weekdays (days) values ('Monday');
insert into weekdays (days) values ('Tuesday');
insert into weekdays (days) values ('Wednesday');
insert into weekdays (days) values ('Thursday');
insert into weekdays (days) values ('Friday');
insert into weekdays (days) values ('Saturday');
insert into weekdays (days) values ('Sunday');

