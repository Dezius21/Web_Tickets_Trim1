// Creates the first administrator in the production database.
// Safe to run more than once: it never deletes anything and skips if the admin exists.
// Needs in .env:  MONGO_URI, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD
// Run:  node bbdd/createAdmin.js
require('dotenv').config();
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model');

async function createAdmin() {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error('Set ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
    }
    if (ADMIN_PASSWORD.length < 8) {
        throw new Error('ADMIN_PASSWORD must have at least 8 characters');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const exists = await User.findOne({ $or: [{ email }, { username: ADMIN_USERNAME }] });
    if (exists) {
        console.log('Admin already exists, nothing to do');
        return;
    }

    await User.create({
        username: ADMIN_USERNAME,
        email,
        password_hash: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: 'Administrador'
    });
    console.log(`Admin "${email}" created in "${mongoose.connection.name}"`);
}

createAdmin()
    .catch(err => { console.error(err.message); process.exitCode = 1; })
    .finally(() => mongoose.disconnect());
