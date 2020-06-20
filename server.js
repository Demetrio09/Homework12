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
            choices: ["View All Employees", "View Employees By Department", "View Employees By Manager", "Add Employee", "Remove Employee", "Quit"],
            name: "choice"
        })
        .then(function (answer) {
            // based on the user answer
            switch (answer.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View Employees By Department":
                    viewEmployeeByDep();
                    break;
                case "View Employees By Manager":
                    viewAllEmployeesByMgr();
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

// function that show all employees
function viewAllEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee LEFT JOIN role ON company_db.role.id = company_db.employee.role_id ORDER BY employee.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function that shows employees by department.
function viewEmployeeByDep() {
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
                // console.log(answer);

                const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee LEFT JOIN role ON company_db.role.id = company_db.employee.role_id LEFT JOIN department ON role.department_id = department.id WHERE (company_db.department.name = "${answer.department}") ORDER BY employee.id`;

                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            });
    });
}

// function to handle additing new employess
function addEmployee() {
    const query = "SELECT role.id, role.title FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
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
                },
                {
                    type: "list",
                    message: `Please choose a role:`,
                    name: "role",
                    choices: () => {
                        let choicesArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choicesArray.push(`${res[i].id}  ${res[i].title}`);
                        }
                        return choicesArray;
                    }
                }
            ])
            .then(function (answer) {
                const roleChoice = answer.role.split(" ");
                // console.log(answer.first_name + answer.last_name);
                let query = "INSERT INTO employee SET ?";
                connection.query(query,
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleChoice[0]
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your new employee has been added successfully!");
                        // call start function
                        start();
                    }
                );
            });
    })
}

// function that handles remove employee
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
                const query = `DELETE FROM employee WHERE id = ${choice[0]}`;
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("The employee has been deleted successfully!");
                    // call start function
                    start();
                });
            });
    });

}
