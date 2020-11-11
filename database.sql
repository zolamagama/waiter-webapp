create table weekdays (

	id serial not null primary key,
	Days text not null

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



insert into waiters (waiter_name) values ('Nwabisa');
insert into waiters (waiter_name) values ('Zola');
insert into waiters (waiter_name) values ('Lulama');




insert into weekdays (Days) values ('Monday');
insert into weekdays (Days) values ('Tuesday');
insert into weekdays (Days) values ('Wednesday');
insert into weekdays (Days) values ('Thursday');
insert into weekdays (Days) values ('Friday');
insert into weekdays (Days) values ('Saturday');
insert into weekdays (Days) values ('Sunday');

