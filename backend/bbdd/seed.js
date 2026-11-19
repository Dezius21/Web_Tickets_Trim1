// Loads the example data into the TEST database.
// Uses the server in MONGO_URI but a separate database ("residencias_test"),
// so your real "residencias" data is never touched. No extra .env entries needed.
// CLI:   node bbdd/seed.js
// Tests: const { connectTestDb, seed } = require('../bbdd/seed');
//        await connectTestDb(); await seed();
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/users.model');
const Property = require('../models/properties.model');
const Ticket = require('../models/tickets.model');

const users = require('./users.bd');
const properties = require('./properties.bd');
const tickets = require('./tickets.bd');

const TEST_PASSWORD = 'Test1234!';
const TEST_DB_NAME = 'residencias_test'; // must contain "test"

// Same server as MONGO_URI, but forcing the test database name
const connectTestDb = () => mongoose.connect(process.env.MONGO_URI, { dbName: TEST_DB_NAME });

async function seed() {
    // Safety: never wipe a database that isn't a test one
    if (!mongoose.connection.name.includes('test')) {
        throw new Error(`Refusing to seed non-test DB: ${mongoose.connection.name}`);
    }

    await Promise.all([User.deleteMany({}), Property.deleteMany({}), Ticket.deleteMany({})]);

    const password_hash = await bcrypt.hash(TEST_PASSWORD, 4); // low cost = faster tests
    await User.insertMany(users.map(u => ({ ...u, password_hash })));
    await Property.insertMany(properties);
    await Ticket.insertMany(tickets);
}

if (require.main === module) {
    connectTestDb()
        .then(seed)
        .then(() => { console.log('Seed complete'); return mongoose.disconnect(); })
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { seed, connectTestDb, TEST_DB_NAME };