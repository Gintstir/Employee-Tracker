USE employee_db;

INSERT INTO department (department_name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),    
    ("Human Resources"),
    ("Business Development"),
    ("Customer Care"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Sales Lead", 65000, 1),
    ("Head Engineer", 72000, 2),
    ("Accountant", 80000, 3),
    ("Director of Human Resources", 112000, 4),
    ("Human Resources Coordinator", 60000, 4),
    ("Business Development Manager", 80000, 5),
    ("Customer Care Specialist", 55000, 6),
    ("Lawyer", 96000, 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
    ("James", "Joyce", 1),
    ("Gabriel", "Marquez", 3),
    ("Dianna", "Burgess", 2),
    ("Faith", "Rodriguez", 6),
    ("Earl", "Harris", 6),
    ("Davin", "Anderson", 7),
    ("Shelly", "Bowen", 4),
    ("Elmer", "Munoz", 5),
    ("Marion", "Jimenez", 1),
    ("Wesley", "Webster", 1),
    ("Alice", "George", 7),
    ("Frank", "Miller", 5),
    ("Anne", "Hearthcount", 3);


