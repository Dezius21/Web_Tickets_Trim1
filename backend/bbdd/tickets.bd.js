const ids = require('./ids.bd');

const tickets = [
    {
        _id: ids.tickets.t1,
        subject: "Fuga en el baño",
        body: "Hay una fuga de agua bajo el lavabo",
        category: "Fontaneria",
        priority: "Alta",
        state: "En proceso",
        createdBy: ids.users.tenant1,
        assignedToUser: ids.users.contr1,
        assignedToProperty: ids.properties.piso1,
        replies: [
            { sender: ids.users.contr1, message: "Paso mañana por la mañana", date: new Date("2026-10-02T09:00:00Z") },
            { sender: ids.users.tenant1, message: "Perfecto, estaré en casa", date: new Date("2026-10-02T10:30:00Z") }
        ],
        ticketHistory: [
            { updatedBy: ids.users.admin,  lastStatus: "Creado",   newStatus: "Asignado" },
            { updatedBy: ids.users.contr1, lastStatus: "Asignado", newStatus: "En proceso" }
        ]
    },
    {
        _id: ids.tickets.t2,
        subject: "Sin luz en el salón",
        body: "Salta el diferencial al encender el salón",
        category: "Electricidad",
        priority: "Media",
        state: "Asignado",
        createdBy: ids.users.tenant1,
        assignedToUser: ids.users.contr2,
        assignedToProperty: ids.properties.casa1,
        replies: [],
        ticketHistory: [
            { updatedBy: ids.users.admin, lastStatus: "Creado", newStatus: "Asignado" }
        ]
    },
    {
        _id: ids.tickets.t3,
        subject: "Grifo de cocina goteando",
        body: "El grifo gotea constantemente",
        category: "Fontaneria",
        priority: "Baja",
        state: "Finalizado",
        createdBy: ids.users.tenant2,
        assignedToUser: ids.users.contr1,
        assignedToProperty: ids.properties.casa1,
        replies: [
            { sender: ids.users.contr1, message: "Arreglado, cambié la junta", date: new Date("2025-11-10T12:00:00Z") }
        ],
        ticketHistory: [
            { updatedBy: ids.users.admin,  lastStatus: "Creado",     newStatus: "Asignado" },
            { updatedBy: ids.users.contr1, lastStatus: "Asignado",   newStatus: "En proceso" },
            { updatedBy: ids.users.contr1, lastStatus: "En proceso", newStatus: "Finalizado" }
        ]
    },
    {
        _id: ids.tickets.t4,
        subject: "Puerta del trastero",
        body: "La cerradura no cierra bien",
        category: "Reparacion",
        // priority omitted -> default "Media"
        // state omitted -> default "Creado"
        createdBy: ids.users.tenant1,
        assignedToProperty: ids.properties.piso1,
        // no assignedToUser: tests the "unassigned" case
        replies: [],
        ticketHistory: [
            // createTicket() always writes this first entry
            { updatedBy: ids.users.tenant1, lastStatus: "Creado", newStatus: "Creado" }
        ]
    }
];

module.exports = tickets;
