-- Active: 1684981779831@@127.0.0.1@3306@employee_tracker_db
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title TEXT NOT NULL
    

);
CREATE TABLE role(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title TEXT NOT NULL,
    salary DECIMAL NOT NULL

);

CREATE TABLE employee(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO role (title, salary) 
VALUES
('Manager', 100000.00),
('Software Engineer', 80000.00),
('Sales Representative', 60000.00),
('Marketing Coordinator', 50000.00),
('Customer Service Representative', 40000.00);



INSERT INTO employee (first_name, last_name, role_id, manager_id) 

VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Bob', 'Johnson', 2, 1),
('Sara', 'Lee', 3, 1),
('Mike', 'Brown', 4, 1),
('Emily', 'Davis', 5, 2),
('Tom', 'Wilson', 5, 2),
('Lisa', 'Taylor', 5, 2),
('Alex', 'Lee', 5, 3),
('Chris', 'Jones', 5, 3),
('Jessica', 'Miller', 5, 3),
('David', 'Clark', 5, 4),
('Amy', 'Garcia', 5, 4),
('Mark', 'Martinez', 5, 4);

INSERT INTO department(title)

VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");