const express = require("express");
const router = express.Router();
const {verificarToken} = require('../middlewares/authMiddleware');
const {verificarAdmin} = require('../middlewares/adminMiddleware');
const libroController = require("../controllers/librosController");

// Rutas públicas (requieren autenticación)
router.get('/libros', verificarToken, libroController.getLibros);
router.get('/libros/:id', verificarToken, libroController.getLibroById);

// Rutas de administrador
router.post('/libros', verificarToken, verificarAdmin, libroController.createLibro);
router.put('/libros/:id', verificarToken, verificarAdmin, libroController.updateLibro);
router.delete('/libros/:id', verificarToken, verificarAdmin, libroController.deleteLibro);

module.exports = router;