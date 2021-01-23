const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');

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



viewAllDepartments = () => {
    console.log('Viewing all departments...\n');
    const query = connection.query(
        'SELECT * FROM department',

        function(err, res) {
            if (err) throw err;
            console.table('Departments: ', res);
            openMenu();
        }
    )
}

viewAllRoles = () => {
    console.log('Viewing all employee roles...\n');
    const query = connection.query(
        'SELECT * FROM role',

        function(err, res) {
            if (err) throw err;
            console.table('Roles: ', res);
            openMenu();
        }
    )
}

viewAllEmployees = () => {
    console.log('Viewing all employees...\n');
    const query = connection.query(
        'SELECT * FROM employee',

        function(err, res) {
            if(err) throw err;
            console.table('Employees: ', res);
            openMenu();
        }
    )
}


quitEmployeeTracker = () => {
    console.log("Thank you for using Employee-Tracker!....Goodbye \n");
    connection.end();
};

