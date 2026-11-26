const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserRoleOrStatus
} = require('../controllers/users.controller.js');

const {
  verifyToken,
  isAdmin,
  checkUserOwnership
} = require('../middlewares/auth.middleware.js');

const {
  validateRegister,
  validateLogin
} = require('../middlewares/validate.middleware.js');

// --- Rutas Públicas (con validación de entrada) ---
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// --- Ruta de Sesión (Protección de rutas en Frontend) ---
// Debe ir antes de '/:id' para que Express no trate "me" como un ObjectId
router.get('/me', verifyToken, getCurrentUser);

// --- Rutas Exclusivas de Administrador ---
router.get('/', verifyToken, isAdmin, getUsers);
router.patch('/:id/permissions', verifyToken, isAdmin, updateUserRoleOrStatus);

// --- Rutas de Perfil (Propietario o Administrador) ---
router.get('/:id', verifyToken, checkUserOwnership, getUserById);
router.put('/:id', verifyToken, checkUserOwnership, updateUserProfile);

module.exports = router;