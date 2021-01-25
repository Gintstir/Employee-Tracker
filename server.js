const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');



//==================================================================================================================
// Connection Properties
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
const openMenu= () => {
    
    inquirer.prompt({
        name: "mainMenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments?",
            "View all roles?",
            "View all employees?",
            "Add a department?",
            "Add a role?",            
            "Add an employee?",
            "Update an employee role?",
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
            case "View all employees?":
                viewAllEmployees();
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
            case "Update an employee role?":
                updateAnEmployeeRole();
                break;
            case "Quit":
                quitEmployeeTracker();
                break;
        }
    })
}


//==================================================================================================================
viewAllDepartments = () => {
    console.log('Viewing all Departments...\n');
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
viewAllRoles = () => {
    console.log('Viewing all Employee Roles...\n');
    const query = connection.query(
        'SELECT * FROM role',

        function(err, res) {
            if (err) throw err;
            console.table('Roles: ', res);
            openMenu();
        }
    )
}

//=============================================================================================================

viewAllEmployees = () => {
    console.log('Viewing all Employees...\n');
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
addADepartment = () => {
    console.log('Adding a new Department...\n');
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
        );
        const query = connection.query(
            'SELECT * FROM department',
            function(err, res) {
                if(err) throw err;
                console.table('Departments with your new addition: ', res);
                openMenu();
            }
        )        
    })    
}



//==================================================================================================
addARole = () => {
    console.log('\n');
    console.log("Adding a new Employee Role...\n");
    dept_db().then(department => {
        const departmentSelection = department.map(({ name: name, id: value }) => ({name, value}));
        inquirer.prompt([
            {
                name: "newRole",
                type: "input",
                message: "What new Employee Role would you like to add?",
                validate: roleAdditionInput => {
                    if(roleAdditionInput) {
                        return true;
                    } else {
                        console.log("Please enter a valid Employee Role!");
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
                    title: answer.newRoll,
                    salary: answer.newSalary,
                    department_id: answer.departmentChoice
                },                    
                function(err, res) {
                    if(err) throw err;
                    console.log('You added a new Role!');

                    openMenu();
                }
            );    
        });
    });    
};


//=====================================================================================================================
addAnEmployee = () => {
    console.log('\n');
    console.log('Adding a new Employee...\n');
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


//===================================================================================================================
quitEmployeeTracker = () => {
    console.log("Thank you for using Employee-Tracker!....\n");
    console.log(figlet.textSync('Goodbye', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
    connection.end();
};

//===========================================================



//access role info in database:
function role_db() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role;",
        function (err, res){
            if(err) reject (err);
            resolve(res);
        })
    })
}
//access department in database
function dept_db() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM department;',
        function (err, res) {
            if(err) reject (err);
            resolve(res);
        })
    })
}