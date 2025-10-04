const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verificarAdmin(req, res, next) {
    try {
        const userId = req.user.userId

        // Obtener el usuario de la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { rol: true }
        })

        if (!usuario) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            })
        }

        if (usuario.rol !== 'admin') {
            return res.status(403).json({
                message: "Acceso denegado. Se requieren permisos de administrador"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            message: "Error al verificar permisos de administrador"
        })
    }
}

module.exports = {
    verificarAdmin
}
