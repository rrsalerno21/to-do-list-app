DROP DATABASE IF EXISTS to_do_DB;

CREATE DATABASE to_do_DB;

USE to_do_DB;

CREATE table tasks (
	id INT NOT NULL AUTO_INCREMENT,
    task_header VARCHAR(100),
    task_details VARCHAR(100),
    status BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
);
