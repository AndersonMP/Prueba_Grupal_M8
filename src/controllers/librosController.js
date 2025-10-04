const librosServices = require('../services/libroServices')

async function getLibros(req, res) {
    try {
        const libros = await librosServices.getLibros();
        res.status(200).json({
            message: "Libros obtenidos correctamente.",
            data: libros,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getLibroById(req, res) {
    try {
        const { id } = req.params;
        const libro = await librosServices.getLibroById(id);
        res.status(200).json({
            message: "Libro obtenido correctamente.",
            data: libro,
        });
    } catch (error) {
        if (error.message === 'Libro no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function createLibro(req, res) {
    try {
        const { titulo, autor, categoria, descripcion } = req.body;

        if (!titulo || !autor || !categoria) {
            return res.status(400).json({ 
                message: "Título, autor y categoría son obligatorios" 
            });
        }

        const libro = await librosServices.createLibro(req.body);
        res.status(201).json({
            message: "Libro creado correctamente.",
            data: libro,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateLibro(req, res) {
    try {
        const { id } = req.params;
        const { titulo, autor, categoria, descripcion } = req.body;

        if (!titulo || !autor || !categoria) {
            return res.status(400).json({ 
                message: "Título, autor y categoría son obligatorios" 
            });
        }

        const libro = await librosServices.updateLibro(id, req.body);
        res.status(200).json({
            message: "Libro actualizado correctamente.",
            data: libro,
        });
    } catch (error) {
        if (error.message === 'Libro no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function deleteLibro(req, res) {
    try {
        const { id } = req.params;
        await librosServices.deleteLibro(id);
        res.status(200).json({
            message: "Libro eliminado correctamente.",
        });
    } catch (error) {
        if (error.message === 'Libro no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro
}