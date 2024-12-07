const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Set the view engine (if using EJS)
app.set('view engine', 'ejs');

// Import routes
const ajoutClientRouter = require('./routes/adduser');
const listeClientRouter = require('./routes/users');
const modifierClientRouter = require('./routes/modifierClient');
const supprimerClientRouter = require('./routes/supprimerClient');

// Use routes
app.use('/api/adduser', ajoutClientRouter);
app.use('/api/users', listeClientRouter);
app.use('/api/modifier', modifierClientRouter); // Changed to '/api/modifier' for consistency with API routes
app.use('/api/supprimerClient', supprimerClientRouter); // Updated path for delete route

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
