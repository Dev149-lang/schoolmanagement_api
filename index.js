const express = require('express');
require('dotenv').config();
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();


app.use(express.json());


app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});