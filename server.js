const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');



//==================================================================================================================
// Create the connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lietuva1991!",
    database: "employee_db"
});

connection.connect(err => {
    if(err) throw err;
    console.log("Connected as ID " + connection.threadId + '\n');

    console.log("============================WELCOME TO=============================\n");
    //insert starting function here?
    console.log(figlet.textSync('EMPLOYEE \n TRACKER', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
    openMenu();
})
//==================================================================================================================

//access role table in database:
role_db = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role;",
        function (err, res){
            if(err) reject (err);
            resolve(res);
        })
    })
}
//access department table in database
dept_db = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM department;',
        function (err, res) {
            if(err) reject (err);
            resolve(res);
        })
    })
}


//==================================================================================================================
// uncomment this and read output to see list of font options
//Gives a list of figlet fonts for the ascii art banner:
// figlet.fonts(function(err, fonts) {
//     if (err) {
//         console.log('something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.dir(fonts);
// });


//===================================================================================================================
//main inquirer menu, give user list of option, return to this menu after every selection
const openMenu= () => {
    
    inquirer.prompt({
        name: "mainMenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments?",
            "View all roles?",
            "View roles by department",
            "View all employees?",
            "View all employees by role",
            "Add a department?",
            "Add a role?",            
            "Add an employee?",
            // "Update an employee role?",
            "Quit"          
        ]
    })
    .then(function (answer) {
        switch (answer.mainMenu) {
            case "View all departments?":
                viewAllDepartments();
                break;
            case "View all roles?":
                viewAllRoles();
                break;
            case "View all roles by Department":
                rolesByDepartment();
                break;
            case "View all employees?":
                viewAllEmployees();
                break;
            case "View all employees by role?":
                employeesByRole();
                break;
            case "Add a department?":
                addADepartment();
                break;
            case "Add a role?":
                addARole();
                break;
            case "Add an employee?":
                addAnEmployee();
                break;
            // case "Update an employee role?":
            //     updateAnEmployeeRole();
            //     break;
            // case "Delete an employee?":
            //     deleteAnEmployee();
            //     break;
            case "Quit":
                quitEmployeeTracker();
                break;
        }
    })
}

//Use console.table to display mysql database info
//==================================================================================================================

//show all departments
viewAllDepartments = () => {
    console.log('\n');
    console.log('Viewing all Departments...\n');
    console.log('\n');

    const query = connection.query(
        'SELECT * FROM department',

        function(err, res) {
            if (err) throw err;
            console.table('Departments: ', res);
            openMenu();
        }
    )
}


//=============================================================================================================
//show all roles
viewAllRoles = () => {

    console.log('\n');
    console.log('Viewing all Employee Roles...\n');
    console.log('\n');

    const query = connection.query(
        'SELECT * FROM role',

        function(err, res) {
            if (err) throw err;
            console.table('Roles: ', res);
            openMenu();
        }
    )
}

//==============================================================================================================
rolesByDepartment = () => {
    console.log('\n');
    console.log('Viewing all roles by Department...\n');
    console.log('\n');

    const query = connection.query(
        'SELECT department_name, title, salary FROM department INNER JOIN role ON role.department_id = department.id',

        function(err, res) {
            if(err) throw err;
            console.table('Roles by Department: ', res);
            openMenu();
        }
    )
}

//=============================================================================================================
//show all employees
viewAllEmployees = () => {
    console.log('\n');
    console.log('Viewing all Employees...\n');
    console.log('\n');

    const query = connection.query(
        'SELECT * FROM employee',

        function(err, res) {
            if(err) throw err;
            console.table('Employees: ', res);
            openMenu();
        }
    )
}



//============================================================================================================
// add a new department to the department table
addADepartment = () => {
    console.log('\n');
    console.log('Adding a new Department...\n');
    console.log('\n');

    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "What department would you like to ADD?",
            validate: departmentAdditionInput => {
                if(departmentAdditionInput) {
                    return true;
                } else {
                    console.log('Please enter a department name!');
                    return false;
                }
            }
        }        
    ])
    .then(function(answer) {
        connection.query(
            'INSERT INTO department SET ?',
            {
                department_name: answer.newDepartment
            },       
            function(err, res) {
                if(err) throw err;                
                console.log('New department has been added...\n');
                openMenu();
            }
        )        
    })    
}



//==================================================================================================
//add a new role to the role table- need to access department table so user can pick which department belongs to.  
//use validation to make sure user enters something.
addARole = () => {
    console.log('\n');
    console.log("Adding a new Employee Role...\n");
    console.log('\n');

    dept_db().then(department => {
        const departmentSelection = department.map(({ department_name: name, id: value }) => ({name, value}));
        inquirer.prompt([
            {
                name: "newRole",
                type: "input",
                message: "What new Role would you like to add?",
                validate: roleAdditionInput => {
                    if(roleAdditionInput) {
                        return true;
                    } else {
                        console.log("Please enter a Role!");
                        return false;
                    }
                }
            },
            {
                name: "newSalary",
                type: "number",
                message: "Please enter a salary for this Role (e.g 35000)."
            },
            {
                name: "departmentChoice",
                type: "list",
                message: "Please select which department this Role belongs to.",
                choices: departmentSelection
            }        
        ])
        .then(function(answer) {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.newRole,
                    salary: answer.newSalary,
                    department_id: answer.departmentChoice
                },                    
                function(err, res) {
                    if(err) throw err;
                    console.log('New role has been added...\n');

                    openMenu();
                }
            );    
        });
    });    
};


//=====================================================================================================================
//add a new employee to the employee table.  Access role table to allow user to select which role the new employee has.
addAnEmployee = () => {

    console.log('\n');
    console.log('Adding a new Employee...\n');
    console.log('\n');

    role_db().then(role => {
        const roleSelection = role.map(({ title: name, id: value}) => ({name, value}));        
        inquirer.prompt([
            {
                name: "newEmployeeFirstName",
                type: "input",
                message: "Please enter the new Emplpoyee's FIRST name."
            },
            {
                name: "newEmployeeLastName",
                type: "input",
                message: "Please enter the new Employee's LAST name."
            },
            {
                name: "employee_role",
                type: 'list',
                message: "What role does this employee have(Please choose one)?",
                choices: roleSelection
                
            }
        ])
        .then(answer => {            
            connection.query(
                'INSERT INTO employee SET ?',
                {
                first_name: answer.newEmployeeFirstName,
                last_name: answer.newEmployeeLastName,
                role_id: answer.employee_role
                },                     
                function(err, res) {
                    if(err) throw err;                    
                    console.log('You added a new Employee!');

                    openMenu();
                }
            );
        });
    });    
};
//========TO DO ==================================================
//Delete an employe from table
//deleteAnEmployee = () => {

//}


//==================TO DO=======================================
// updateAnEmployeeRole = async () => {
//     console.log('\n');
//     console.log('Upadating an Employee role...\n');

//     // employee_db_toUpdate().then(employee => {
        
//     //     const employeeSelection = employee.map(({ name: employee.first_name + " " + employee.last_name, id: value}));

//     inquirer.prompt([
//         {
//             name: "employeeToUpdate",
//             type: "list",
//             message: "Which employee would you like to update?",
//             choices: await employeeSelection()
//         },
//         {
//             name: "newRole",
//             type: "list",
//             message: "What is this employee's new role?",
//             choices: await 
//         }
//     ])
//     .then(answer => {
//         connection.query(
//             'UPDATE employee SET '
//         )
//     })
//     })
// }


//===================================================================================================================
quitEmployeeTracker = () => {
    console.log('\n');
    console.log("Thank you for using Employee-Tracker!....\n");
    console.log('\n');

    console.log(figlet.textSync('Goodbye', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
    connection.end();
};

//===================================================================================================================





//======================TO DO ================================================
//access employee table in database
// employee_db = () => {    
//     return new Promise((resolve, reject) => {        
//         connection.query('SELECT * FROM employee;',
//         function(err, res) {
//             if (err) reject (err);
//             resolve(res);
//         })
//     })
// }