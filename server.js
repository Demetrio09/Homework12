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
            switch (answer.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
            }
            // connection.end();
        });
}

function viewAllEmployees() {
    const query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${i+1}:  ${res[i].last_name}, ${res[i].first_name}`);
        }
        // console.log(res);
        connection.end();
    })
}