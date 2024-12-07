const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Render form to modify client
router.get('/:ID_client', (req, res) => {
    const ID_client = req.params.ID_client;

    db.query('SELECT * FROM client WHERE ID_client = ?', [ID_client], (err, clientResults) => {
        if (err) throw err;

        db.query('SELECT * FROM region', (err, regionResults) => {
            if (err) throw err;

            res.render('modifier_client', { client: clientResults[0], regions: regionResults });
        });
    });
});

// Handle form submission for modifying client
router.post('/:ID_client', (req, res) => {
    const ID_client = req.params.ID_client;
    const { nom, prenom, age, ID_region } = req.body;

    db.query(
        'UPDATE client SET nom = ?, prenom = ?, age = ?, ID_region = ? WHERE ID_client = ?',
        [nom, prenom, age, ID_region, ID_client],
        (err) => {
            if (err) throw err;
            res.redirect('/liste_client');
        }
    );
});

module.exports = router;
