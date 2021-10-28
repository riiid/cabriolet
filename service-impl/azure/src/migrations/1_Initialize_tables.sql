create table if not exists formats
(
    id serial not null primary key,
    name varchar(255),
    description varchar(255),
    "parentFormatId" varchar(255) default 'undefined',
    "validatorIds" text[]
);

create table if not exists edges
(
    "fromFormatId" varchar(255),
    "toFormatId" varchar(255),
    "converterId" varchar(255)
);

create table if not exists validators
(
    id serial not null primary key,
    name varchar(255),
    description varchar(255),
    src varchar(255),
    integrity varchar(255)
);

create table if not exists converters
(
    id serial not null primary key,
    name varchar(255),
    description varchar(255),
    src varchar(255),
    integrity varchar(255)
);
