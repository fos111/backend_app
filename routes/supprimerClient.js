const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Database connection

// DELETE client by ID
router.delete('/:ID_client', async (req, res) => {
    const { ID_client } = req.params;

    if (!ID_client) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    const query = 'DELETE FROM client WHERE ID_client = @ID_client';

    try {
        const pool = await db.connectToDatabase(); // Connect to the database
        const result = await pool.request()
            .input('ID_client', db.sql.Int, ID_client) // Parameterized query
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting client:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
