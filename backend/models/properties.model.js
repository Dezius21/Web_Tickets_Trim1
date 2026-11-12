const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema(
    {
        address:{
            type: String,
            required: true
        },
        type:{
            type: String,
            enum:["Piso","Casa","Finca",],
            required: true
        },
        description:{
            type: String,
            required: true
        },
        state:{
            type: Boolean,
            default: true
        }

    }

)

const Property = mongoose.model("property",propertySchema);

module.exports = Property;

