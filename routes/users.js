const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Database connection

// Fetch all users
router.get('/', async (req, res) => {
    const query = `
        SELECT 
            c.ID_client AS id,
            CONCAT(c.nom, ' ', c.prenom) AS name,
            c.age,
            r.libelle AS region
        FROM client c
        LEFT JOIN region r ON c.ID_region = r.ID_region;
    `;

    try {
        const pool = await db.connectToDatabase(); // Get the connection pool
        const result = await pool.request().query(query); // Execute the query
        res.json(result.recordset); // Respond with the query results
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
