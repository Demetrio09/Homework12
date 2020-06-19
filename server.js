// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

// MySQL Connection Information(credentials)
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "demetriov635",
    database: "company_db"
});

// Connect to the MySQL server and SQL database
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employess By Manager", "Add Employee", "Remove Employee"],
            name: "choice"
        })
        .then(function (answer) {
            // based on the user answer
            console.log(answer);
            connection.end();
        });
}