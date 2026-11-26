const propertiesRouter = require('express').Router();
const porpertiesController = require('../controllers/properties.controller');

const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateObjectId } = require('../middlewares/validate.middleware');
const {
  getProperties, getPropertyById, createProperty, updateProperties, deleteProperty
} = require('../controllers/properties.controller');

propertiesRouter.use(verifyToken);

propertiesRouter.get('/', getProperties);
propertiesRouter.get('/:id', validateObjectId, getPropertyById);
propertiesRouter.post('/', authorizeRoles('Administrador'), createProperty);
propertiesRouter.patch('/:id', validateObjectId, authorizeRoles('Administrador'), updateProperties);
propertiesRouter.delete('/:id', validateObjectId, authorizeRoles('Administrador'), deleteProperty); // soft delete

module.exports = propertiesRouter;

