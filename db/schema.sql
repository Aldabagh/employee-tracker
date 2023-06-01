-- Active: 1684981779831@@127.0.0.1@3306@employee_tracker_db
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO role (title, salary) 
VALUES
    ('Manager', 100000.00),
    ('Software Engineer', 80000.00),
    ('Sales Representative', 60000.00),
    ('Marketing Coordinator', 50000.00),
    ('CS Representative', 40000.00);

INSERT INTO department (id, title)
VALUES
    (1, 'Sales'),
    (2, 'Marketing'),
    (3, 'Engineering'),
    (4, 'Finance'),
    (5, 'Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 120000, 1),
    ('Salesperson', 70000, 1),
    ('Marketing Manager', 90000, 2),
    ('Marketing Associate', 50000, 2),
    ('Engineering Director', 160000, 3),
    ('Software Engineer', 85000, 3),
    ('Accounting Manager', 160000, 4),
    ('Accountant', 125000, 4),
    ('Legal Team Lead', 280000, 5),
    ('Lawyer', 160000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Joe', 'Dirt', 2, 1),
    (3, 'Happy', 'Gilmore', 3, NULL),
    (4, 'Tom', 'Cruise', 4, 3),
    (5, 'Matthew', 'Barry', 5, NULL),
    (6, 'Field', 'Yates', 6, 5),
    (7, 'Tina', 'Baker', 7, NULL),
    (8, 'Daniel', 'Dopp', 8, NULL) 
