// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Quit":
                    connection.end();
                    break;
            };
        });
}

function viewAllEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployeesByDep() {
    const query = "SELECT * FROM employee LEFT JOIN role ON company_db.role.id = company_db.employee.role_id ORDER BY employee.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

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
                    // call start function
                    start();
                }
            );
        });
}

// function that handles remove employe
function removeEmployee() {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Wich employee would you like to remove?",
                    name: "choice",
                    choices: () => {
                        let choicesArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choicesArray.push(`${res[i].id} ${res[i].first_name} ${res[i].last_name}`);
                        }
                        return choicesArray;
                    },
                }
            ])
            .then(function (answer) {
                const choice = answer.choice.split(" ");
                // console.log(choice);
                const query = `DELETE FROM employee WHERE id = ${choice[0]}`;
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("your employee has been deleted!");
                    // call start function
                    start();
                });
            });
    });

}
