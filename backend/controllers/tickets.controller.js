const Ticket = require('../models/tickets.model.js');

// 1. Create a new ticket (Client / Admin)
const createTicket = async (req, res) => {
  try {
    const { subject, body, category, priority, assignedToProperty } = req.body;
    const createdBy = req.user.id; // Extracted from auth middleware

    if (!subject || !body || !category || !priority) {
      return res.status(400).json({ message: 'Missing required fields: subject, body, category, priority' });
    }

    const newTicket = await Ticket.create({
      subject,
      body,
      category,
      priority,
      createdBy,
      assignedToProperty,
      ticketHistory: [
        {
          updatedBy: createdBy,
          lastStatus: 'Creado',
          newStatus: 'Creado'
        }
      ]
    });

    return res.status(201).json({
      message: 'Ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data format or enum value', error: error.message });
    }
    return res.status(500).json({ message: 'Internal server error creating ticket', error: error.message });
  }
};

// 2. Get all tickets with role-based access and query filters
const getTickets = async (req, res) => {
  try {
    const { state, priority, category, propertyId } = req.query;
    const { id: userId, role } = req.user; // Extracted from auth middleware

    let filter = {};

    // Role-based ownership enforcement
    if (role === 'cliente') {
      filter.createdBy = userId;
    } else if (role === 'agente') {
      filter.assignedToUser = userId;
    }
    // Admin has no ownership restriction and sees all

    // Query filters
    if (state) filter.state = state;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (propertyId) filter.assignedToProperty = propertyId;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'nombre email')
      .populate('assignedToUser', 'nombre email')
      .populate('assignedToProperty', 'address type')
      .sort({ createdAt: -1 });

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving tickets', error: error.message });
  }
};

// 3. Get single ticket by ID with ownership check
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'nombre email')
      .populate('assignedToUser', 'nombre email')
      .populate('assignedToProperty', 'address type')
      .populate('replies.sender', 'nombre rol')
      .populate('ticketHistory.updatedBy', 'nombre rol');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Security check: Client A cannot view Client B's ticket
    const { id: userId, role } = req.user;
    if (role === 'cliente' && ticket.createdBy._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this ticket' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving ticket details', error: error.message });
  }
};

// 4. Assign ticket to an agent (Admin only)
const assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    const adminId = req.user.id;

    if (!agentId) {
      return res.status(400).json({ message: 'agentId is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const previousStatus = ticket.state;
    ticket.assignedToUser = agentId;
    ticket.state = 'Asignado';
    
    ticket.ticketHistory.push({
      updatedBy: adminId,
      lastStatus: previousStatus,
      newStatus: 'Asignado'
    });

    await ticket.save();

    return res.status(200).json({
      message: 'Ticket assigned successfully',
      data: ticket
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error assigning ticket', error: error.message });
  }
};

// 5. Update ticket status or priority and log history
const updateTicketStatus = async (req, res) => {
  try {
    const { state, priority } = req.body;
    const userId = req.user.id;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (priority) {
      ticket.priority = priority;
    }

    if (state && state !== ticket.state) {
      const previousStatus = ticket.state;
      ticket.state = state;

      ticket.ticketHistory.push({
        updatedBy: userId,
        lastStatus: previousStatus,
        newStatus: state
      });
    }

    await ticket.save();

    return res.status(200).json({
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid status or priority value', error: error.message });
    }
    return res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};

// 6. Add a reply message to the ticket thread
const addTicketReply = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Reply message cannot be empty' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Security check: Only ticket creator, assigned agent, or admin can reply
    const { role } = req.user;
    const isCreator = ticket.createdBy.toString() === senderId;
    const isAssignedAgent = ticket.assignedToUser && ticket.assignedToUser.toString() === senderId;

    if (role !== 'admin' && !isCreator && !isAssignedAgent) {
      return res.status(403).json({ message: 'Access denied: Not authorized to reply to this ticket' });
    }

    ticket.replies.push({
      sender: senderId,
      message
    });

    await ticket.save();

    return res.status(201).json({
      message: 'Reply added successfully',
      data: ticket.replies[ticket.replies.length - 1]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};

// 7. Delete ticket (Admin only)
const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  addTicketReply,
  deleteTicket
};

/*
 * TODO - Middlewares de Autenticación y Autorización (auth.middleware.js):
 *
 * 1. verifyToken (Autenticación):
 *    - Leer y verificar el JWT de los headers (Authorization: Bearer <token>).
 *    - Inyectar el payload decodificado en `req.user` (ej. `{ id, role }`) para usarlo en los controladores.
 *    - Responder 401 (Unauthorized) si no hay token o es inválido/expirado.
 *
 * 2. authorizeRoles(...allowedRoles) (Autorización por Rol):
 *    - Comprobar que `req.user.role` esté incluido en los roles permitidos ('cliente', 'agente', 'admin').
 *    - Responder 403 (Forbidden) si el rol no tiene permisos (ej. Cliente intentando entrar a rutas de Admin).
 *
 * 3. checkTicketOwnership (Propiedad del Recurso - Crítico para defensa):
 *    - Validar que si `req.user.role === 'cliente'`, el `createdBy` del ticket coincida con `req.user.id`.
 *    - Si es 'agente', validar que coincida con `assignedToUser` (para modificaciones/respuestas).
 *    - Si es 'admin', permitir el paso directo (`next()`). Devolver 403 si no cumple.
 */