require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

// Declaramos orígenes que pueden acceder a nuestra API
const corsOptions = {
    origin: "http://localhost:3000" || process.env.CORS_ORIGIN,
    credentials: true
}

// Usamos el midleware para usar cors en nuestras peticiones HTTP
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API backend funcionando.')
});

app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}/`);
    console.log(`Documentación disponible en: http://localhost:${port}/docs`);
});
