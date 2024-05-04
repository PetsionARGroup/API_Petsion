require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./config/mongo');

const PORT = process.env.PORT || 3000;
const app = express(); // Crear objeto de aplicación Express

app.use(cors());   // Habilitar CORS
app.use(express.json());

app.use(require('./app/routes'))

dbConnect();

app.listen(PORT, () => {
    console.log('API lista por el puerto', PORT);
});
