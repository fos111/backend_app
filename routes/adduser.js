const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Database connection

// Render ajout_client form (optional, if you use server-side rendering)
router.get('/', async (req, res) => {
    try {
        const pool = await db.connectToDatabase(); // Connect to the database
        const result = await pool.request().query('SELECT * FROM region'); // Query all regions
        const regions = result.recordset; // Extract regions from the result
        res.render('ajout_client', { regions }); // Render form with regions
    } catch (err) {
        console.error('Error fetching regions:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission (POST method)
router.post('/', async (req, res) => {
    const { nom, prenom, age, ID_region } = req.body;

    // Check if all fields are provided
    if (!nom || !prenom || !age || !ID_region) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const pool = await db.connectToDatabase(); // Connect to the database

        // Check if the user already exists in the database
        const checkUserQuery = `
            SELECT * FROM client WHERE nom = @nom AND prenom = @prenom
        `;
        const checkUserResult = await pool.request()
            .input('nom', db.sql.NVarChar, nom)
            .input('prenom', db.sql.NVarChar, prenom)
            .query(checkUserQuery);

        if (checkUserResult.recordset.length > 0) {
            // User exists, update their information
            const updateQuery = `
                UPDATE client SET age = @age, ID_region = @ID_region
                WHERE nom = @nom AND prenom = @prenom
            `;
            await pool.request()
                .input('age', db.sql.Int, age)
                .input('ID_region', db.sql.Int, ID_region)
                .input('nom', db.sql.NVarChar, nom)
                .input('prenom', db.sql.NVarChar, prenom)
                .query(updateQuery);

            res.status(200).json({ message: 'User updated successfully' });
        } else {
            // User does not exist, insert new user
            const insertQuery = `
                INSERT INTO client (nom, prenom, age, ID_region)
                VALUES (@nom, @prenom, @age, @ID_region)
            `;
            await pool.request()
                .input('nom', db.sql.NVarChar, nom)
                .input('prenom', db.sql.NVarChar, prenom)
                .input('age', db.sql.Int, age)
                .input('ID_region', db.sql.Int, ID_region)
                .query(insertQuery);

            res.status(201).json({ message: 'User added successfully' });
        }
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
