const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
connectDB() .then(() => { app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); }); }) 
    .catch((error) => {
        console.error('Failed to start server:', error.message); process.exit(1); 
    });
