const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const saltRounds = 10;
async function registerUser(data) {
    const userExists = await userRepository.getByEmail(data.email);
    if (userExists) throw new Error("El usuario ya existe");
    
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    const user = await userRepository.createUser({ ...data, password: hashPassword});

    return user;
}

const secretKey = jwtSecret;

async function loginUser(data) {
    const user = await userRepository.getByEmail(data.email);
    if (!user) throw new Error("Usuario no encontrado");

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) throw new Error("Contraseña incorrecta");

    const payload = {
        userId: user.id,
        email: user.email
    }

    // Firmar

    const token = jwt.sign(payload, secretKey, {
        expiresIn: "1h"
    });

    return token;
}




module.exports = {
    registerUser,
    loginUser,
}