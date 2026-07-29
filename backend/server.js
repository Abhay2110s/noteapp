const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

connectDB()

if(NODE_ENV === 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}