const mongoose = require('mongoose')

const assignedTicketSchema = new mongoose.Schema(
    {
        ticketId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ticket"
        }
    }
)

const userSchema = new mongoose.Schema(
    {
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password_hash:{
        type: String,
        required: true,
        select: false
    },
    role:{
        type: String,
        required: true,
        trim: true,
        enum:["Administrador","Inquilino","Contratista"]
    },
    state:{
        type: Boolean,
        default: true
    },
    assignedTickets:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ticket"
        }]
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("user",userSchema);

module.exports = User;