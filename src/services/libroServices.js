const libroRepository = require('../repositories/libroRepository')

async function getLibros() {
    return await libroRepository.getLibros()
}

async function getLibroById(id) {
    const libro = await libroRepository.getLibroById(id)
    if (!libro) {
        throw new Error('Libro no encontrado')
    }
    return libro
}

async function createLibro(data) {
    // Validar datos requeridos
    if (!data.titulo || !data.autor || !data.categoria) {
        throw new Error('Título, autor y categoría son obligatorios')
    }

    return await libroRepository.createLibro(data)
}

async function updateLibro(id, data) {
    // Verificar que el libro existe
    const libroExistente = await libroRepository.getLibroById(id)
    if (!libroExistente) {
        throw new Error('Libro no encontrado')
    }

    // Validar datos requeridos
    if (!data.titulo || !data.autor || !data.categoria) {
        throw new Error('Título, autor y categoría son obligatorios')
    }

    return await libroRepository.updateLibro(id, data)
}

async function deleteLibro(id) {
    // Verificar que el libro existe
    const libroExistente = await libroRepository.getLibroById(id)
    if (!libroExistente) {
        throw new Error('Libro no encontrado')
    }

    return await libroRepository.deleteLibro(id)
}

async function marcarComoNoDisponible(id) {
    const libro = await libroRepository.getLibroById(id)
    if (!libro) {
        throw new Error('Libro no encontrado')
    }

    return await libroRepository.updateDisponibilidad(id, false)
}

async function marcarComoDisponible(id) {
    const libro = await libroRepository.getLibroById(id)
    if (!libro) {
        throw new Error('Libro no encontrado')
    }

    return await libroRepository.updateDisponibilidad(id, true)
}

module.exports = {
    getLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro,
    marcarComoNoDisponible,
    marcarComoDisponible
}