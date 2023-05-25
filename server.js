    // Load environment variables from.env file
    require("dotenv").config();
    const inquirer = require("inquirer");
    const express = require("express");
    const db = require("./db/db");
    // Define port number to use for server
    const PORT = 3000;
    // Create an instance of the Express application
    const app = express();
    const { table } = require("table");
    const figlet = require("figlet");
    const inq = inquirer.createPromptModule();
    
    const getNameOfItem = (item) => {
        return `What is the name of the ${item}?`;
    };
    const includes = (choice, str) => {
        return choice.toLocaleLowerCase().includes(str);
    };
    const choices = [
    "exit",
    "Add Department",
    "Update Employee Role",
    "View all departments",
    "View all roles",
    "View all employees",
    "Add Employee",
    " Add Role",
    ];

    const beginQuestions = () => {
    inq([
        {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices,
        },
    ]).then((data) => {
        if (data.action === "exit") {
        process.exit();
        }
// Loop through choices and handle each case
        for (let choice of choices) {
        if (data.action === choice) {
            // cases where user wants to add or update an item
            if (includes(choice, "add") || includes(choice, "update")) {
            let c = choice.toLocaleLowerCase().split(" ");

            inq([
                {
                type: "input",
                name: c[1],
                message: getNameOfItem(c[1]),
                },
            ]).then((data) => {
                console.log(data);
                beginQuestions();
            });
            }
            // Handle cases where user wants to view all items
            else if (includes(choice, "view")) {
                const nameOfTable = choice.split(" ")[2];
                let singularName = nameOfTable.replace("s", "");
                const queryTable = `SELECT * FROM ${singularName};`;


            // Use the figlet library to format the output
            figlet(singularName.replace(/$/i, "s").toUpperCase(), (err, data) => {
                db.query(queryTable, (err, res) => {
                    const tHead = Object.keys(res[0]);
                    const tBody = res.map((r) => Object.values(r));
                    console.log(data);
                    console.log(" ");
                    console.log(table([[...tHead], ...tBody]));

                inq([
                    {
                    type: "confirm",
                    name: "continueQuestions",
                    message: "Would you like to continue?",
                    },
                ]).then((data) => {
                    const { continueQuestions } = data;
                    if (continueQuestions) {
                        beginQuestions();
                    } else {
                        process.exit();
                    }
                });
                });
            });
            }
        }
        }
    });
    };
    beginQuestions();
    // Start the server
    app.listen(process.env.LOCAL_PORT, () => {
        console.log(`Listening on port ${process.env.LOCAL_PORT}`.blue);
    });
