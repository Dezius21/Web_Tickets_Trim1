const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema(
    {
        tenantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required: true
        },
        start:{
            type: Date,
            default: Date.now
        },
        end:{
            type: Date,
            default: null
        }
    }
)

const propertySchema = new mongoose.Schema(
    {
        address:{
            type: String,
            required: true
        },
        type:{
            type: String,
            enum:["Piso","Casa","Finca"],
            required: true
        },
        description:{
            type: String,
            required: true
        },
        state:{
            type: Boolean,
            default: true
        },
        ownedby:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required = true
        },
        tenants:{
            type:[tenantSchema],
            default:[]
        }

    },
    {
        timestamps: true
    }

)

const Property = mongoose.model("property",propertySchema);

module.exports = Property;

