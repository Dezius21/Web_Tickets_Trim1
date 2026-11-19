const ids = require('./ids.bd');

// password_hash is added in seed.js (all users get the password "Test1234!")
const users = [
    {
        _id: ids.users.admin,
        username: "admin",
        email: "admin@test.com",
        role: "Administrador",
        state: true,
        assignedTickets: []
    },
    {
        _id: ids.users.tenant1,
        username: "laura_inquilina",
        email: "laura@test.com",
        role: "Inquilino",
        state: true,
        assignedTickets: []
    },
    {
        _id: ids.users.tenant2,
        username: "pedro_inquilino",
        email: "pedro@test.com",
        role: "Inquilino",
        state: false, // inactive user, useful to test filters
        assignedTickets: []
    },
    {
        _id: ids.users.contr1,
        username: "fontanero_juan",
        email: "juan@test.com",
        role: "Contratista",
        state: true,
        assignedTickets: [ids.tickets.t1, ids.tickets.t3]
    },
    {
        _id: ids.users.contr2,
        username: "electricista_ana",
        email: "ana@test.com",
        role: "Contratista",
        state: true,
        assignedTickets: [ids.tickets.t2]
    }
];

module.exports = users;
