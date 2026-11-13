const mongoose = require('mongoose')

const ticketReplySchema = new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        message:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
)

const ticketHistorySchema = new mongoose.Schema(
    {
        updatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        lastStatus:{
            type: mongoose.Schema.Types.String,
            enum:["Creado","Asignado","En proceso","Finalizado"]
        },
        newStatus:{
            type: mongoose.Schema.Types.String,
            enum:["Creado","Asignado","En proceso","Finalizado"]
        }

    }
)

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
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        assignedToUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        assignedToProperty:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"property"
        },
        replies:{
            type:[ticketReplySchema],
            default:[]
        },
        ticketHistory:{
            type:[ticketHistorySchema],
            default:[]
        }

    },
    {
        timestamps: true
    }

)



const Ticket = mongoose.model("ticket",ticketSchema);

module.exports = Ticket;