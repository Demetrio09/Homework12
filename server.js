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
            choices: ["View All Employees", "View All Employees By Department", "View All Employess By Manager", "Add Employee", "Remove Employee", "EXIT"],
            name: "choice"
        })
        .then(function (answer) {
            // based on the user answer
            switch (answer.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees By Department":
                    viewAllEmployeesByDep();
                    break;
                case "View All Employess By Manager":
                    getDepartments();
                    break;
                case "EXIT":
                    connection.end();
                    break;
            };
        });
}

function viewAllEmployees() {
    const query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${i + 1}:  ${res[i].last_name}, ${res[i].first_name}`);
        };
        start();
    });
};

function getDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                type: "rawlist",
                message: "Choose a department:",
                choices: () => {
                    let choicesArray = [];
                    for (let i = 0; i < res.length; i++) {
                        choicesArray.push(res[i].name);
                    }
                    return choicesArray;
                },
                name: "department"
            })
            .then(function (answer) {
                console.log(answer);
            })
        // console.log(res);
        start();
    });
}

function viewAllEmployeesByDep() {
    const query = "SELECT * FROM employee LEFT JOIN role ON company_db.role.id = company_db.employee.role_id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${i + 1}:  ${res[i].last_name}, ${res[i].first_name} - ${res[i].title}`);
        };
        console.log(res);
        start();
    });
};