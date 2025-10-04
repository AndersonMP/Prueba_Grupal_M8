require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const libroRoutes = require('./routes/librosRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const { apiReference } = require('@scalar/express-api-reference');

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
app.use('/api', libroRoutes);
app.use('/api', prestamoRoutes);

// API REFERENCE
app.use(
    "/docs",
    apiReference({
        theme: "purple",
        layout: "modern",
        spec: {
            url: "/api/openapi.yaml",
        },
        configuration: {
            showSidebar: true,
            hideDownloadButton: false,
            hideTryItPanel: false,
            preferredSecurityScheme: "bearerAuth",
        },
    })
);

app.get("/api/openapi.yaml", (req, res) => {
    res.setHeader("Content-Type", "application/x-yaml");
    res.sendFile(path.join(__dirname, "../docs/openapi.yaml"));
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}/`);
    console.log(`Documentación disponible en: http://localhost:${port}/docs`);
});
