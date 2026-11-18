const Ticket = require('../models/tickets.model.js');

const createTicket = async (req, res) => {
  try {
    const { subject, body, category, priority, assignedToProperty } = req.body;
    const createdBy = req.user.id;

    if (!subject || !body || !category) {
      return res.status(400).json({ message: 'Missing required fields: subject, body, category' });
    }

    const newTicket = await Ticket.create({
      subject,
      body,
      category,
      ...(priority && { priority }),
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

const getTickets = async (req, res) => {
  try {
    const { state, priority, category, propertyId } = req.query;
    const { id: userId, role } = req.user;

    let filter = {};

    if (role === 'Inquilino') {
      filter.createdBy = userId;
    } else if (role === 'Contratista') {
      filter.assignedToUser = userId;
    }

    if (state) filter.state = state;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (propertyId) filter.assignedToProperty = propertyId;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedToUser', 'username email')
      .populate('assignedToProperty', 'address type')
      .sort({ createdAt: -1 });

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving tickets', error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedToUser', 'username email')
      .populate('assignedToProperty', 'address type')
      .populate('replies.sender', 'username role')
      .populate('ticketHistory.updatedBy', 'username role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const { id: userId, role } = req.user;
    if (role === 'Inquilino' && ticket.createdBy._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this ticket' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving ticket details', error: error.message });
  }
};

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

    const { role } = req.user;
    const isCreator = ticket.createdBy.toString() === senderId;
    const isAssignedWorker = ticket.assignedToUser && ticket.assignedToUser.toString() === senderId;

    if (role !== 'Administrador' && !isCreator && !isAssignedWorker) {
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

const getWorkerTicketMetrics = async (req, res) => {
  try {
    const workerId = req.user.id;

    const [pendientes, totalesAsignados, urgentes, completados] = await Promise.all([
      Ticket.countDocuments({ assignedToUser: workerId, state: { $ne: 'Finalizado' } }),
      Ticket.countDocuments({ assignedToUser: workerId }),
      Ticket.countDocuments({ assignedToUser: workerId, priority: 'Alta', state: { $ne: 'Finalizado' } }),
      Ticket.countDocuments({ assignedToUser: workerId, state: 'Finalizado' })
    ]);

    return res.status(200).json({
      pendientes,
      totalesAsignados,
      urgentes,
      completados
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating worker ticket metrics', error: error.message });
  }
};

const getAdminTicketMetrics = async (req, res) => {
  try {
    const [
      totalesAsignados,
      totalesPorAsignar,
      urgentesSinAsignar,
      urgentesAsignados
    ] = await Promise.all([
      Ticket.countDocuments({ assignedToUser: { $ne: null } }),
      Ticket.countDocuments({ assignedToUser: null }),
      Ticket.countDocuments({ priority: 'Alta', assignedToUser: null, state: { $ne: 'Finalizado' } }),
      Ticket.countDocuments({ priority: 'Alta', assignedToUser: { $ne: null }, state: { $ne: 'Finalizado' } })
    ]);

    return res.status(200).json({
      totalesAsignados,
      totalesPorAsignar,
      urgentesSinAsignar,
      urgentesAsignados
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating admin ticket metrics', error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  addTicketReply,
  deleteTicket,
  getWorkerTicketMetrics,
  getAdminTicketMetrics
};