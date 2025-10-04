const express = require("express");
const router = express.Router();
const {verificarToken} = require('../middlewares/authMiddleware');
const prestamoController = require("../controllers/prestamoController");

// Rutas de préstamos (requieren autenticación)
router.post('/prestamos', verificarToken, prestamoController.crearPrestamo);
router.put('/prestamos/:id/devolver', verificarToken, prestamoController.devolverPrestamo);
router.get('/prestamos', verificarToken, prestamoController.getPrestamosByUsuario);
router.get('/prestamos/historial', verificarToken, prestamoController.getHistorialByUsuario);
router.get('/prestamos/:id', verificarToken, prestamoController.getPrestamoById);

module.exports = router;
