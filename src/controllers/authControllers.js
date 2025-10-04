const authServices = require('../services/authServices');
const blackListRepo = require("../repositories/tokenBlackListRepository")
async function registerUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const user = await authServices.registerUser(req.body);

        // Crear un nuevo objeto sin la contraseña
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: "Usuario registrado correctamente",
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const token = await authServices.loginUser(req.body);
        res.json({
            message: "Usuario logueado correctamente",
            data: token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

async function logoutUser(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        message: "No se proporcionó el token"
    })

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ 
        message: "No se proporcionó el token modificado"
    })

    await blackListRepo.agregarToken(token)
    res.json({message: "Logout ejecutado correctamente"})
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}