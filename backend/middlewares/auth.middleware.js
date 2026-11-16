const jwt = require('jsonwebtoken');
const User = require('../models/users.model');



const verifyToken = async (req,res,next) => {
    try {
        const header = req.headers['authorization'];

        if(!header || !header.startsWith("Bearer ") ){
            return res.status(401).json({message: "Token no proporcionado"});
        }

        const token = header.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(payload.id);
        
        if(!user || !user.state){
            return res.status(401).json({message: "Usuario no valido"})
        }


        req.user = {id: user._id.toString(), role: user.role};
        next();
        
    } 
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "La sesión ha caducado." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token no válido." });
        }
            return res.status(500).json({ message: "Error al verificar la sesión." });
    }
}


const isAdmin = (req,res,next) => {
    if(!req.user || req.user.role !== "Administrador")
    {
        return res.status(403).json({message: "Permisos insuficientes"});
    }

    next();
}

const checkUserOwnership = (req,res,next) => {
    const isOwner = req.user && req.params.id === req.user.id;
    const isAdminUser = req.user && req.user.role === "Administrador";

    if(!isOwner && !isAdminUser)
    {
        return res.status(403).json({message: "Solo puedes acceder a tu propio perfil"})
    }

    next();
}

module.exports = { verifyToken, isAdmin, checkUserOwnership };