const prestamoRepository = require('../repositories/prestamoRepository')
const libroRepository = require('../repositories/libroRepository')
const historialRepository = require('../repositories/historialRepository')

async function crearPrestamo(data) {
    const { usuarioId, libroId } = data

    // Validar datos requeridos
    if (!usuarioId || !libroId) {
        throw new Error('Usuario ID y Libro ID son obligatorios')
    }

    // Verificar que el libro existe y está disponible
    const libro = await libroRepository.getLibroById(libroId)
    if (!libro) {
        throw new Error('Libro no encontrado')
    }

    if (!libro.disponible) {
        throw new Error('El libro no está disponible para préstamo')
    }

    // Crear el préstamo
    const prestamo = await prestamoRepository.createPrestamo(data)

    // Marcar el libro como no disponible
    await libroRepository.updateDisponibilidad(libroId, false)

    return prestamo
}

async function devolverPrestamo(id) {
    // Verificar que el préstamo existe
    const prestamo = await prestamoRepository.getPrestamoById(id)
    if (!prestamo) {
        throw new Error('Préstamo no encontrado')
    }

    if (prestamo.fechaDevolucion) {
        throw new Error('El préstamo ya fue devuelto')
    }

    // Actualizar el préstamo con fecha de devolución
    const prestamoDevuelto = await prestamoRepository.devolverPrestamo(id)

    // Marcar el libro como disponible
    await libroRepository.updateDisponibilidad(prestamo.libroId, true)

    // Mover el préstamo al historial
    await prestamoRepository.moverPrestamoAHistorial(id)

    return prestamoDevuelto
}

async function getPrestamosByUsuario(usuarioId) {
    return await prestamoRepository.getPrestamosByUsuario(usuarioId)
}

async function getHistorialByUsuario(usuarioId) {
    return await historialRepository.getHistorialByUsuario(usuarioId)
}

async function getPrestamoById(id) {
    const prestamo = await prestamoRepository.getPrestamoById(id)
    if (!prestamo) {
        throw new Error('Préstamo no encontrado')
    }
    return prestamo
}

module.exports = {
    crearPrestamo,
    devolverPrestamo,
    getPrestamosByUsuario,
    getHistorialByUsuario,
    getPrestamoById
}
