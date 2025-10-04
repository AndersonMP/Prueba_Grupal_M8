const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

async function getLibros() {
    return await prisma.libro.findMany({
        where: { disponible: true }
    })
}

async function getLibroById(id) {
    return await prisma.libro.findUnique({
        where: { id: parseInt(id) }
    })
}

async function createLibro(data) {
    return await prisma.libro.create({
        data: {
            titulo: data.titulo,
            autor: data.autor,
            categoria: data.categoria,
            descripcion: data.descripcion || null,
            disponible: true
        }
    })
}

async function updateLibro(id, data) {
    return await prisma.libro.update({
        where: { id: parseInt(id) },
        data: {
            titulo: data.titulo,
            autor: data.autor,
            categoria: data.categoria,
            descripcion: data.descripcion || null
        }
    })
}

async function deleteLibro(id) {
    return await prisma.libro.delete({
        where: { id: parseInt(id) }
    })
}

async function updateDisponibilidad(id, disponible) {
    return await prisma.libro.update({
        where: { id: parseInt(id) },
        data: { disponible }
    })
}

module.exports = {
    getLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro,
    updateDisponibilidad
}