const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

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

async function createHistorial(data) {
    return await prisma.historial.create({
        data: {
            usuarioId: data.usuarioId,
            libroId: data.libroId,
            fechaPrestamo: data.fechaPrestamo,
            fechaDevolucion: data.fechaDevolucion
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

module.exports = {
    getHistorialByUsuario,
    createHistorial
}
