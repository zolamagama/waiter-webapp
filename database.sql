create table weekdays (

	id serial not null primary key,
	Days text not null

);

create table waiters (

id serial not null primary key,
waiter_name text not null,
days_selected int not null,
foreign key(days_selected) references weekdays(id)

);


insert into weekdays (Days) values ('Monday');
insert into weekdays (Days) values ('Tuesday');
insert into weekdays (Days) values ('Wednesday');
insert into weekdays (Days) values ('Thursday');
insert into weekdays (Days) values ('Friday');
insert into weekdays (Days) values ('Saturday');
insert into weekdays (Days) values ('Sunday');
