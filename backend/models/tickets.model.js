const mongoose = require('mongoose')

const

const ticketSchema = new mongoose.Schema(
    {
        subject:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        },
        category:{
            type: String,
            required: true,
            enum:["Fontaneria","Electricidad","Reparacion","Otros"]
        },
        priority:{
            type: String,
            required: true,
            enum:["Baja","Media","Alta"]
        },
        state:{
            type: String,
            enum:["Creado","Asignado","En proceso","Finalizado"],
            default: "Creado"
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,ref:'User'
        },
        assignedTo:{
            type: mongoose.Schema.Types.ObjectId,ref:'User'
        },

    },
    {
        timestamps: true,
        versionKey: false
    }

)

const Ticket = mongoose.model("ticket",ticketSchema);

module.exports = Ticket;