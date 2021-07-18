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
  
      switch (answers.menuChoices) {
  
        case "View all departments":
          viewAllDepartments();
          break;
      
        }
    })
}

viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
      if (err) {
        throw err;
      }
      console.table(res);
      init();
    });
  };