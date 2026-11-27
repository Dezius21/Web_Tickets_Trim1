// Loads the example data into the database in MONGO_URI (residencias).
// WARNING: this DELETES all users, properties and tickets in that database first.
// CLI:  node bbdd/seed.js --force
require('dotenv').config();
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/users.model');
const Property = require('../models/properties.model');
const Ticket = require('../models/tickets.model');

const users = require('./users.bd');
const properties = require('./properties.bd');
const tickets = require('./tickets.bd');

const TEST_PASSWORD = 'Test1234!';

const connectDb = () => mongoose.connect(process.env.MONGO_URI);

async function seed() {
    await Promise.all([User.deleteMany({}), Property.deleteMany({}), Ticket.deleteMany({})]);

    const password_hash = await bcrypt.hash(TEST_PASSWORD, 10);
    await User.insertMany(users.map(u => ({ ...u, password_hash })));
    await Property.insertMany(properties);
    await Ticket.insertMany(tickets);
}

if (require.main === module) {
    // Safety: never run the example-data seed against production
    if (process.env.NODE_ENV === 'production') {
        console.error('Refusing to run the example seed with NODE_ENV=production');
        process.exit(1);
    }
    // Safety: the script only runs if you explicitly confirm with --force
    if (!process.argv.includes('--force')) {
        console.error(`This will DELETE users, properties and tickets in ${process.env.MONGO_URI}.\nRun again with --force to confirm:  node bbdd/seed.js --force`);
        process.exit(1);
    }
    connectDb()
        .then(seed)
        .then(() => { console.log(`Seed complete in "${mongoose.connection.name}"`); return mongoose.disconnect(); })
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { seed, connectDb };