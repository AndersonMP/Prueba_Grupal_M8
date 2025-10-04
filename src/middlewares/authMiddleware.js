const jwt = require('jsonwebtoken')
const blackListRepo = require('../repositories/tokenBlackListRepository')
const secretKey = process.env.JWT_SECRET;

async function verificarToken(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        message: "No se proporcionó el token"
    })

    const token = authHeader.split(" ")[1];

    if(!token) return res.status(401).json({
        message: "No se proporcionó el token modificado"
    })

    const revocado = await blackListRepo.estaRevocado(token);
    if (revocado) return res.status(401).json({message: "Token revocado"})

    try {
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido"
        })
    }
}


module.exports = {
    verificarToken
}