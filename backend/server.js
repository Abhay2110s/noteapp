const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});