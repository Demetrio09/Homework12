INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 100000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 150000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 120000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Laywer", 120000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Legal Team Lead", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("John", "Doe", 3);
INSERT INTO employee (first_name, last_name, role_id,  manager_id) VALUES ("Mike", "Chan", 4, 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Sara", "Rodriguez", 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Allen", 6, 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Tom", "Brown", 1);

 let obj = () => { for (let i = 0; i < res.length; i++) {
            return res[i].id, res[i].first_name,  res[i].last_name,   res[i].title, res[i].name;
        }};
        console.log(obj);
        console.table([obj]);