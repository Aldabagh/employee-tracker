    // Load environment variables from.env file
    require("dotenv").config();
    const inquirer = require("inquirer");
    // const express = require("express");
    const db = require("./db/db");
    // const inq = inquirer.createPromptModule();
    
    let newEmployee = [];
let updatedEmployee = [];

promptStart = () => {

    console.log(`
    -----------------------------------------
    -----------------------------------------  
    *           |EMPLOYEE TRACKER|          *
    *               |DATABASE|              *
    *                                       *
    *   SELECT AN OPTION FROM THE LIST      *
    * OR SELECT EXIT TO CLOSE THE DATABASE  *
    -----------------------------------------
    -----------------------------------------
    `)
}


init = () => {
    promptStart();
    start();
}

start = () => {
    inquirer.prompt([
        {
            name: "startFunc",
            type: "rawlist",
            message: "Welcome to your Employee Database. \n What would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "Exit Database"
            ]
        }
    ]).then(function (answers) {
        switch (answers.startFunc) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Departments":
                viewByDepartments();
                break;
            case "View All Roles":
                viewByRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Exit Database":
                endApp();
                break;
        }
    })
}

// View employee, department & role functions
viewEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.title AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
}

viewByDepartments = () => {
    db.query("SELECT * FROM department;", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
}

viewByRoles = () => {
    db.query("SELECT * FROM role;", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
}

// Add employee, department & role functions
addEmployee = () => {
    db.query("SELECT * from employee", async (err, results) => {
        try {
            const newName = await inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employees first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employees last name?"
                }
            ]).then(function (answers) {
                newEmployee.push(answers.firstName, answers.lastName);
            });
        } catch (err) {
            console.log(err);
        }
        db.query("SELECT * FROM role", async (err, roleresult) => {
            try {
                const newRole = await inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeRole",
                        message: "What is the new employee's role?",
                        choices: roleresult.map(function (role) {
                            return {
                                name: role.title,
                                value: role.id
                            }
                        })
                    }
                ]).then(function (answers) {
                    newEmployee.push(answers.employeeRole);
                });
            } catch (err) {
                console.log(err);
            }
            db.query("SELECT * FROM employee WHERE manager_id IS NULL;", async (err, mangresults) => {
                try {
                    const newManager = await inquirer.prompt([
                        {
                            type: "list",
                            name: "employeeManager",
                            message: "Who is the new employee's manager?",
                            choices: mangresults.map(function (manag) {
                                return {
                                    name: manag.first_name + " " + manag.last_name,
                                    value: manag.id
                                }
                            })
                        }
                    ]).then(function (answers) {
                        newEmployee.push(answers.employeeManager);
                        db.query("INSERT INTO employee (??) VALUES (?, ?, ?, ?);", [["first_name", "last_name", "role_id", "manager_id"], newEmployee[0], newEmployee[1], newEmployee[2], newEmployee[3]], function (err, newEmpResults) {
                            if (err) throw err;
                            console.log("A New Employee has been added to your Database!");
                            start();
                        })
                    })
                } catch (err) {
                    console.log(err);
                }
            })
        })
    });
}

addDepartment = () => {
    inquirer.prompt({
        type: "input",
        name: "newDepart",
        message: "What department do you want to add?"
    }).then(function (answers) {
        db.query("INSERT INTO department (title) VALUES (?);", answers.newDepart, function (err, results) {
            if (err) throw err;
            console.log("A new department has been added to your Database.");
            start();
        });
    })
}

addRole = () => {
    db.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "What role do you want to add?"
            },
            {
                type: "input",
                name: "newSalary",
                message: "What is the salary for this new role?"
            },
            {
                type: "list",
                name: "deptRole",
                message: "What department is the new role in?",
                choices: res.map(function (roleRow) {
                    return {
                        name: roleRow.name,
                        value: roleRow.id
                    }
                })
            }
        ]).then(function (answers) {
            db.query("INSERT INTO role (??) VALUES (?, ?, ?);", [["title", "salary", "department_id"], answers.newRole, answers.newSalary, answers.deptRole], function (err, res) {
                if (err) throw err;
                console.log("A new role has been added to your Database");
                start();
            })
        })
    })
}


updateEmployee = () => {
    db.query("SELECT id, role_id, CONCAT (first_name,' ', last_name) AS name FROM employee", async (err, res) => {
        try {
            const editedEmployee = await inquirer.prompt([
                {
                    type: "list",
                    name: "updateEmp",
                    message: "What employee do you want to update?",
                    choices: res.map(function (empRow) {
                        return {
                            name: empRow.name,
                            value: empRow.id
                        }
                    })
                }
            ]).then(function (answers) {
                updatedEmployee.push(answers.updateEmp);
            });
        } catch (err) {
            console.log(err);
        }
        db.query("SELECT * FROM role", async (err, res) => {
            try {
                const updatedRole = await inquirer.prompt([
                    {
                        type: "list",
                        name: "roleUpdated",
                        message: "Select the employee's role",
                        choices: res.map(function(empNewRole) {
                            return {
                                name: empNewRole.title,
                                value: empNewRole.id
                            }
                        })
                    }
                ]).then(function (answers) {
                    updatedEmployee.push(answers.roleUpdated);
                    employeeUpdate(answers);
                });
            } catch (err) {
                console.log(err);
                
            }
        })
        start();
    });
}

employeeUpdate = () => {
    db.query("UPDATE employee SET role_id = ? WHERE id = ?", [updatedEmployee[1], updatedEmployee[0], function (err, res) {
        if (err) throw err;
        console.log("You have successfully updated the employee's role.");
        start();
    }])
}

// Exit function
endApp = () => {
    console.log("Goodbye!");
    db.end();
}

// Starts prompts for user in terminal
init();