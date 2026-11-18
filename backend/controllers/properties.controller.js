const PropertySchema = require('../models/properties.model.js');

const getProperties = async (req, res) => {
  try{
    const { type, state, search } = req.query;
    let filter = {};

    if(type){
      filter.type = type;
    }
    if(state !== undefined){
      filter.state = state === 'true';
    }
    if(search){
      filter.address = {$regex: search, $options: 'i'};
    }

    const result = await PropertySchema.find(filter).populate('ownedby', 'nombre email rol');
    return res.status(200).json(result);
  }catch(error){
    console.log(`Error al obtener los datos: ${error}`);
    return res.status(500).json({
      error: 'No se han podido obtener los datos'
    })
  }
};

const getPropertyById = async (req, res) => {
  try{
    const property = await PropertySchema.findById(req.params.id)
      .populate('ownedby', 'nombre email rol')
      .populate('tenants.tenantId', 'nombre email');
    if(!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    return res.status(200).json(property);
  }catch(error){
    return res.status(500).json({
      message: 'Error al obtener la propiedad',
      error: error.message
    });
  }
};

const createProperty = async (req, res) => {
  try{
    const { address, type, description, ownedby } = req.body;
    if (!address || !type || !description || !ownedby){
      return res.status(400).json({ message : 'Debe rellenar los campos obligatoriamente'})
    }

    const newProperty = await PropertySchema.create(req.body);
    return res.status(201).json({
      message: 'Propiedad creada correctamente',
      data: newProperty,
    })
  }catch(error){
    console.error(`Error al crear propiedad: ${error}`);
    if (error.name === 'ValidationError'){
      return res.status(400).json({
      message: 'Datos inválidos',
      error: error.message
    });  
    }
    return res.status(500).json({
      message: 'Error interno del servidor al crear la propiedad',
      error: error.message
    });
  }
};

const updateProperties = async (req, res) => {
  try {
    const updatedProperty = await PropertySchema.findByIdAndUpdate(
      req.params.id,  
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    return res.status(200).json(updatedProperty);
  }catch(error){
    res.status(500).json({
      message: 'Error interno del servidor al actualizar la propiedad',
      error: error.message
    });
  }
}

const _deletePropertyFromDB = async (req, res) => {
  try{
    const deletedProperty = await PropertySchema.findByIdAndDelete(req.params.id);
    if (!deletedProperty){
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    return res.status(200).json({ message: 'Propiedad Eliminada correctamente' });
  }catch (error) {
    return res.status(500).json({
      message: 'Error interno del servidor al eliminar la propiedad',
      error: error.message
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const deactivatedProperty = await PropertySchema.findByIdAndUpdate(
      req.params.id,
      { state: false },
      { new: true }
    );

    if (!deactivatedProperty) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    
    return res.status(200).json({ 
      message: 'Propiedad desactivada correctamente (Soft Delete)',
      data: deactivatedProperty
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno del servidor al desactivar la propiedad',
      error: error.message
    });
  }
};


module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperties,
  deleteProperty
}
