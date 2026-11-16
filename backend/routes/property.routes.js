const propertiesRouter = require('express').Router();
const porpertiesController = require('../controllers/properties.controller');

propertiesRouter.post('', porpertiesController) //Falta definir el método que va a usar. 