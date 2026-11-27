const ids = require('./ids.bd');

const properties = [
    {
        _id: ids.properties.piso1,
        address: "Calle Mayor 10, 2ºA, Madrid",
        type: "Piso",
        description: "Piso de 3 habitaciones en el centro",
        state: true,
        ownedby: ids.users.admin,
        tenants: [
            // current tenant (end: null)
            { tenantId: ids.users.tenant1, start: new Date("2026-01-01"), end: null }
        ]
    },
    {
        _id: ids.properties.casa1,
        address: "Avenida de los Olivos 5, Getafe",
        type: "Casa",
        description: "Casa adosada con jardín",
        state: true,
        ownedby: ids.users.admin,
        tenants: [
            // past tenant + current one
            { tenantId: ids.users.tenant2, start: new Date("2024-03-01"), end: new Date("2025-12-31") },
            { tenantId: ids.users.tenant1, start: new Date("2026-02-01"), end: null }
        ]
    },
    {
        _id: ids.properties.finca1,
        address: "Camino Rural s/n, Toledo",
        type: "Finca",
        description: "Finca rústica con almacén",
        state: false, // vacant / inactive
        ownedby: ids.users.admin,
        tenants: []
    }
];

module.exports = properties;
