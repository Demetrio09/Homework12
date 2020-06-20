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
    console.log("Welcome to our Employee Manager App!")
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employess By Manager", "Add Employee", "Remove Employee", "Quit"],
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
                    // viewAllEmployeesByMgr();
                    break;
                case "Add Employee":
                    addEmployee();
                case "Quit":
                    connection.end();
                    break;
            };
        });
}

function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(`
id  First Name  Last Name   Title   Department  Salary  Manager
--  ----------  ---------   -----   ----------  ------  -------`);
        for (let i = 0; i < res.length; i++) {
            console.log(`
${res[i].id}  ${res[i].first_name}        ${res[i].last_name}
`)
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
                type: "list",
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
                start();
            })
    });
}

// function to handle additing new employess
function addEmployee() {
    // prompt for info about the new employee
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the employee's first name:",
                name: "first_name"
            },
            {
                type: "input",
                message: "Please enter the employee's last name:",
                name: "last_name"
            }
        ])
        .then(function (answer) {
            console.log(answer.first_name + answer.last_name);
            let query = "INSERT INTO employee SET ?";
            connection.query(query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your new employee has been added successfully!");
                    start();
                }
            );
        });
}

function viewAllEmployeesByDep() {
    const query = "SELECT * FROM employee LEFT JOIN role ON company_db.role.id = company_db.employee.role_id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].id}  ${res[i].last_name}, ${res[i].first_name} - ${res[i].title}; ${res[i].salary}
            `);
        };
        // console.log(res);
        start();
    });
};