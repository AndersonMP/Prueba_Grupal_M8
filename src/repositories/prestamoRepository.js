const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

async function createPrestamo(data) {
    return await prisma.prestamo.create({
        data: {
            usuarioId: data.usuarioId,
            libroId: data.libroId,
            fechaPrestamo: new Date(),
            fechaDevolucion: null
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    email: true
                }
            },
            libro: {
                select: {
                    id: true,
                    titulo: true,
                    autor: true,
                    categoria: true
                }
            }
        }
    })
}

async function getPrestamoById(id) {
    return await prisma.prestamo.findUnique({
        where: { id: parseInt(id) },
        include: {
            usuario: {
                select: {
                    id: true,
                    email: true
                }
            },
            libro: {
                select: {
                    id: true,
                    titulo: true,
                    autor: true,
                    categoria: true
                }
            }
        }
    })
}

async function getPrestamosByUsuario(usuarioId) {
    return await prisma.prestamo.findMany({
        where: { 
            usuarioId: parseInt(usuarioId),
            fechaDevolucion: null
        },
        include: {
            libro: {
                select: {
                    id: true,
                    titulo: true,
                    autor: true,
                    categoria: true
                }
            }
        }
    })
}

async function devolverPrestamo(id) {
    const prestamo = await prisma.prestamo.findUnique({
        where: { id: parseInt(id) }
    });

    // Verifica si el préstamo ya tiene fecha de devolución
    if (prestamo.fechaDevolucion !== null) {
        throw new Error('El libro ya fue devuelto');
    }

    // Actualiza la fecha de devolución
    const updatedPrestamo = await prisma.prestamo.update({
        where: { id: parseInt(id) },
        data: {
            fechaDevolucion: new Date() // Asigna la fecha actual como la fecha de devolución
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    email: true
                }
            },
            libro: {
                select: {
                    id: true,
                    titulo: true,
                    autor: true,
                    categoria: true
                }
            }
        }
    });

    // Mueve el préstamo al historial
    await prisma.historial.create({
        data: {
            usuarioId: updatedPrestamo.usuarioId,
            libroId: updatedPrestamo.libroId,
            fechaPrestamo: updatedPrestamo.fechaPrestamo,
            fechaDevolucion: updatedPrestamo.fechaDevolucion
        }
    });

    return updatedPrestamo;
}


async function getHistorialByUsuario(usuarioId) {
    return await prisma.historial.findMany({
        where: { usuarioId: parseInt(usuarioId) },
        include: {
            libro: {
                select: {
                    id: true,
                    titulo: true,
                    autor: true,
                    categoria: true
                }
            }
        },
        orderBy: {
            fechaDevolucion: 'desc'
        }
    })
}

async function moverPrestamoAHistorial(prestamoId) {
    const prestamo = await prisma.prestamo.findUnique({
        where: { id: parseInt(prestamoId) },
        include: {
            usuario: true,
            libro: true
        }
    })

    if (!prestamo) {
        throw new Error('Préstamo no encontrado');
    }

    if (!prestamo.fechaDevolucion) {
        throw new Error('El préstamo no tiene fecha de devolución');
    }

    // Crear registro en historial
    await prisma.historial.create({
        data: {
            usuarioId: prestamo.usuarioId,
            libroId: prestamo.libroId,
            fechaPrestamo: prestamo.fechaPrestamo,
            fechaDevolucion: prestamo.fechaDevolucion
        }
    });

    // Eliminar préstamo
    await prisma.prestamo.delete({
        where: { id: parseInt(prestamoId) }
    })

    return prestamo
}

module.exports = {
    createPrestamo,
    getPrestamoById,
    getPrestamosByUsuario,
    devolverPrestamo,
    getHistorialByUsuario,
    moverPrestamoAHistorial
}
