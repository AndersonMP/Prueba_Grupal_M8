const prestamoServices = require('../services/prestamoServices')

async function crearPrestamo(req, res) {
    try {
        const { libroId } = req.body;
        const usuarioId = req.user.userId;

        if (!libroId) {
            return res.status(400).json({ 
                message: "Libro ID es obligatorio" 
            });
        }

        const prestamo = await prestamoServices.crearPrestamo({
            usuarioId,
            libroId
        });

        res.status(201).json({
            message: "Préstamo creado correctamente.",
            data: prestamo,
        });
    } catch (error) {
        if (error.message === 'Libro no encontrado' || error.message === 'El libro no está disponible para préstamo') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function devolverPrestamo(req, res) {
    try {
        const { id } = req.params;
        const prestamo = await prestamoServices.devolverPrestamo(id);

        res.status(200).json({
            message: "Libro devuelto correctamente.",
            data: prestamo,
        });
    } catch (error) {
        if (error.message === 'Préstamo no encontrado' || error.message === 'El préstamo ya fue devuelto') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function getPrestamosByUsuario(req, res) {
    try {
        const usuarioId = req.user.userId;
        const prestamos = await prestamoServices.getPrestamosByUsuario(usuarioId);

        res.status(200).json({
            message: "Préstamos obtenidos correctamente.",
            data: prestamos,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getHistorialByUsuario(req, res) {
    try {
        const usuarioId = req.user.userId;
        const historial = await prestamoServices.getHistorialByUsuario(usuarioId);

        res.status(200).json({
            message: "Historial obtenido correctamente.",
            data: historial,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPrestamoById(req, res) {
    try {
        const { id } = req.params;
        const prestamo = await prestamoServices.getPrestamoById(id);

        res.status(200).json({
            message: "Préstamo obtenido correctamente.",
            data: prestamo,
        });
    } catch (error) {
        if (error.message === 'Préstamo no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    crearPrestamo,
    devolverPrestamo,
    getPrestamosByUsuario,
    getHistorialByUsuario,
    getPrestamoById
}
