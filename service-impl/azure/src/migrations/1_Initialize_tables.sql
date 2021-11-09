create table if not exists formats
(
    id serial not null primary key,
    name varchar(255),
    description varchar(255),
    "validatorIds" text[]
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
    "fromFormatId" integer,
    "toFormatId" integer,
    name varchar(255),
    description varchar(255),
    src varchar(255),
    integrity varchar(255)
);
