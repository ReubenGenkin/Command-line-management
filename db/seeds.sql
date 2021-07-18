INSERT INTO department (name)
VALUES
("Sales"),
("Accounting"),
("Human Resources"),
("Warehouse");


INSERT INTO roles (title, salary, department_id)
VALUES 
("Manager", "75000", 1),
("Salesperson", "60000", 1),
("Senior Accountant", "55000", 2),
("Accountant", "50000", 2),
("Human Resources Rep", "60000", 3),
("Customer Service Rep", "30000", 3),
("Supplier Relations", "37000", 3),
("Warehouse Foreman", "55000", 4),
("Warehouse Worker", "40000", 4),
("Receptionist", "30000", 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Michael", "Scott", 1, NULL),
("Dwight", 'Schrute', 2, 1),
('Jim', 'Halpert', 2, 1),
('Angela', 'Martin', 3, 1),
('Kevin', 'Malone', 3, 4),
('Oscar', 'Martinez', 3, 4),
('Toby', 'Flenderson', 5, NULL),
('Kelly', 'Kapoor', 6, 1),
('Meredith', 'Palmer', 7, 1),
('Pamela', 'Beasley', 10, 1),
('Darryl', 'Philbin', 8, 1),
('Hidetoshi', 'Hasegawa', 9, 11);


