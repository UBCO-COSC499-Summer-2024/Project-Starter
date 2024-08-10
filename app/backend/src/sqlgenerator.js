const bcrypt = require('bcrypt');
const fs = require('fs');

const saltRounds = 10;
const users = [
    { id: 18273645, firstName: 'Nic', lastName: 'Kouwen', email: 'nic.kouwen@gmail.com', password: 'capstonerocks', role: 1},
    { id: 12345678, firstName: 'Nic', lastName: 'Kouwen', email: 'nk@email.com', password: 'ilovecosc', role: 1 },
    { id: 23456789, firstName: 'Jane', lastName: 'Doe', email: 'janedoe@email.com', password: 'password123', role: 1 },
    { id: 34567890, firstName: 'John', lastName: 'Smith', email: 'johnsmith@email.com', password: 'securepass456', role: 1 },
    { id: 45678901, firstName: 'Alice', lastName: 'Johnson', email: 'alicejohnson@email.com', password: 'mypassword789', role: 1 },
    { id: 56789012, firstName: 'Bob', lastName: 'Brown', email: 'bobbrown@email.com', password: 'qwerty987', role: 1 },
    { id: 67890123, firstName: 'Jay', lastName: 'Bhullar', email: 'jb@email.com', password: 'ilovecapstone', role: 2 },
    { id: 78901234, firstName: 'Nathan', lastName: 'Jacinto', email: 'nj@email.com', password: 'scottsthebest', role: 2 },
    { id: 89012345, firstName: 'Jack', lastName: 'Mathisen', email: 'jm@email.com', password: 'ilovecosc499', role: 2 },
    { id: 90123456, firstName: 'Oakley', lastName: 'Pankratz', email: 'op@email.com', password: 'math>cosc', role: 2 },
    { id: 28102810, firstName: 'Alexander', lastName: 'Grischuk', email: 'alexander.grischuk@email.com', password: 'password123', role: 1 },
    { id: 69, firstName: 'Mia', lastName: 'Khalifa', email: 'mia.khalifa@email.com', password: 'password123', role: 1 },
    { id: 22211111, firstName: 'Bob', lastName: 'Liu', email: 'bob.liu@email.com', password: 'password123', role: 1 },
    { id: 13, firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@email.com', password: 'password123', role: 1 },
    { id: 2, firstName: 'Nathan', lastName: 'Jacinto', email: 'nathan.jacinto1@email.com', password: 'password123', role: 1 },
    { id: 4, firstName: 'Scott', lastName: 'Fazackerly', email: 'scott.fazackerly@email.com', password: 'password123', role: 1 },
    { id: 18897231, firstName: 'Arthur', lastName: 'Duncan', email: 'arthur.duncan@email.com', password: 'password123', role: 1 },
    { id: 22111111, firstName: 'Paul', lastName: 'Smith', email: 'paul.smith@email.com', password: 'password123', role: 1 },
    { id: 69696969, firstName: 'Jonny', lastName: 'Sins', email: 'jonny.sins@email.com', password: 'password123', role: 1 },
    { id: 12, firstName: 'Suyash', lastName: 'Shingare', email: 'suyash.shingare@email.com', password: 'password123', role: 1 },
    { id: 11, firstName: 'Chinny', lastName: 'Wong', email: 'chinny.wong@email.com', password: 'password123', role: 1 },
    { id: 10, firstName: 'Nic', lastName: 'Kouwenhov', email: 'nic.kouwenhov@email.com', password: 'password123', role: 1 },
    { id: 9, firstName: 'Fran', lastName: 'Perellak', email: 'fran.perellak@email.com', password: 'password123', role: 1 },
    { id: 5, firstName: 'Kevin', lastName: 'Wang', email: 'kevin.wang@email.com', password: 'password123', role: 1 },
    { id: 22, firstName: 'Nathan', lastName: 'Jacinto', email: 'nathan.jacinto2@email.com', password: 'password123', role: 1 },
    { id: 8, firstName: 'Jay', lastName: 'Bhullar', email: 'jay.bhullar@email.com', password: 'password123', role: 1 },
    { id: 6, firstName: 'Mqhamad', lastName: 'Khejezade', email: 'mqhamad.khejezade@email.com', password: 'password123', role: 1 },
    { id: 7, firstName: 'Jack', lastName: 'Mathisen', email: 'jack.mathisen@email.com', password: 'password123', role: 3 }
];

const hashPasswords = async () => {
    let hashedUsers = [];
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        hashedUsers.push({
            ...user,
            password: hashedPassword
        });
    }

    let sqlStatements = hashedUsers.map(user => 
        `INSERT INTO users (id, first_name, last_name, email, password, role) VALUES (${user.id}, '${user.firstName}', '${user.lastName}', '${user.email}', '${user.password}', ${user.role});`
    ).join('\n');

    fs.writeFileSync('hashed_users.sql', sqlStatements);
};

hashPasswords().then(() => {
    console.log('Hashed passwords and generated SQL file.');
}).catch(err => {
    console.error('Error hashing passwords:', err);
});