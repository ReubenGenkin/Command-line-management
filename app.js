//node dependencies
var inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');


// error handling for server start
db.connect(err => {
    if (err) throw err
    console.log('Database connected.')
    init();

    //search the db before continuing
    getRoles();
    getManagers();
});

function init() {
    //initial prompts
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }

    ]).then(answers => {

        //switch to change outcome based on answer
        switch (answers.menuChoices) {

            case "View all departments":
                viewAllDepartments();
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "View all employees":
                viewAllEmployees();
                break;

            case "Add a department":
                addDepartment();
                break;

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "Update an employee role":
                updateEmployee();
                break;
        }
    })
}

// query the database to select all from department
viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        init();
    });
};

// query the database to select all from roles
viewAllRoles = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        init();
    });
};

// query db to select all from employees
viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        init();
    });
};

// prompt the user to select from options to add a new department
addDepartment = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the new department?',
        }
    ]).then(answer => {
        db.query(`INSERT INTO department (name) VALUES ('${answer.deptName}')`, (err, res) => {
            if (err) throw err;
            console.log(`You successfully added ${answer.deptName} to the database!`);
            viewAllDepartments();
            //init();
        })
    })
};

// funtion to add a role using prompts to have the user select the desired options/inputs
addRole = () => {


    let names = [];
    let deptID = [];
    db.query(`SELECT * FROM department`, (err, res) => {
        //console.log(res);
        for (i = 0; i < res.length; i++) {
            names.push(res[i].name);
            deptID.push(res[i].id);
        }
    })

    // inquirer prompts
    inquirer.prompt([
        {
            type: 'input',
            name: 'inputTitle',
            message: 'What is the title of the new role?',
        },
        {
            type: 'input',
            name: 'inputSalary',
            message: 'What is the salary of the new role?',
        },
        {
            type: 'list',
            name: 'deptSelect',
            message: 'What department is this role a part of?',
            choices: names
        }
    ]).then(answers => {

        //for loop to get the index  of the item in the name array
        for (i = 0; i < names.length; i++) {

            //mathcing the index of the two arrays to get the proper ID
            if (names[i] === answers.deptSelect) {

                // query db to insert the three needed values
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.inputTitle}', '${answers.inputSalary}', '${deptID[i]}')`, (err, res) => {
                    if (err) throw err;
                    console.log(`You successfully added ${answers.title} and ${answers.inputSalary} to the database!`);
                    viewAllRoles();

                })
            }
        }
    })
};

getRoles = () => {
    db.query("SELECT id, title FROM roles", (err, res) => {
      if (err) throw err;
      roles = res;
      //console.table(roles);
    })
  };
  
  getManagers = () => {
    db.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
      if (err) throw err;
      managers = res;
      //console.table(managers);
    })
  };

// queries the DB to add employee
addEmployee = () => {

    //empty arrays to hold the information from the for loops
    let managersArray = [];
    let rolesArray = [];

    //query the db to list all role choices
    db.query("SELECT * FROM roles;", (err, res) => {

        for (let i = 0; i < res.length; i++) {

            //place info in rolesArray for id and title
            rolesArray.push({ id: res[i].id, title: res[i].title });
        }

        //query for the first and last name
        db.query("SELECT * FROM employee", (err, val) => {
            for (let i = 0; i < val.length; i++) {

                // push those into the designated array
                managersArray.push({ id: val[i].id, firstName: val[i].first_name });
            }

            //inquirer prompts
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the first name of the new employee?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the new employee?',
                },

                //get the rolo array to display a likst of choices
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of the new employee?',
                    choices: rolesArray.map(role => role.title)
                },

                //getting the first name of the managers
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the manager of the new employee?',
                    choices: managersArray.map(manager => manager.firstName)
                }

            ]).then(answer => {

                //getting the ID
                let role_id = rolesArray.map(role => role.title).indexOf(answer.role);
                console.log(role_id)

                //using find to get the right manager
                const manager_id = managersArray.find(manager => manager.firstName === answer.manager).id;
                console.log(manager_id)

                // queriying the DB to insert the new employee
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${role_id}', '${manager_id}');`, (err, res) => {
                    if (err) throw err;
                    console.log(`You successfully added ${answer.firstName} ${answer.lastName} to your database!`);
                    viewAllEmployees();
                }
                )
            })
        })
    }
    )
}

//query the db to update an existing emplyee
updateEmployee = () => {

    //arrays for the information from the for loops
    let employeeArray = [];
    let rolesArray = [];

    //getting the info for the employee
    db.query("SELECT * FROM employee", (err, val) => {
        for (let i = 0; i < val.length; i++) {
            employeeArray.push({ id: val[i].id, firstName: val[i].first_name });
        }

        //getting the roles to display as answers
        db.query("SELECT * FROM roles;", (err, res) => {
            for (let i = 0; i < res.length; i++) {
                rolesArray.push({ id: res[i].id, title: res[i].title });
            }

            //inquirer prompts
            inquirer.prompt([

                {
                    type: 'list',
                    name: 'employees',
                    message: 'Which employee would you like to update?',
                    choices: employeeArray.map(employee => employee.firstName)
                },

                //displaying roles form the array as the choices
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of the new employee?',
                    choices: rolesArray.map(role => role.title)
                }


            ]).then(answer => {

                //finding ID
                const employee_id = employeeArray.find(employee => employee.firstName === answer.employees).id;
                console.log(employee_id)

                let role_id = rolesArray.map(role => role.title).indexOf(answer.role);
                console.log(role_id)


                db.query("UPDATE employee SET role_id = ? WHERE id = ?;", [role_id, employee_id],
                    (err, res) => {
                        if (err) throw err
                        console.log(`You successfully update ${answer.employees}'s role!`)
                        viewAllEmployees();
                    }
                )
            })
        })
    }
    )
}

