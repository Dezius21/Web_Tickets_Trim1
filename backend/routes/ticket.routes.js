const ticketsRouter = require('express').Router();
const ticketsController = require('../controllers/tickets.controller');

const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateObjectId } = require('../middlewares/validate.middleware');
const {
  createTicket, getTickets, getTicketById, assignTicket, updateTicketStatus,
  addTicketReply, deleteTicket, getWorkerTicketMetrics, getAdminTicketMetrics
} = require('../controllers/tickets.controller');

ticketsRouter.use(verifyToken);


ticketsRouter.get('/metrics/worker', authorizeRoles('Contratista'), getWorkerTicketMetrics);
ticketsRouter.get('/metrics/admin', authorizeRoles('Administrador'), getAdminTicketMetrics);

ticketsRouter.post('/', authorizeRoles('Inquilino', 'Administrador'), createTicket);
ticketsRouter.get('/', getTickets);
ticketsRouter.get('/:id', validateObjectId, getTicketById);
ticketsRouter.patch('/:id/assign', validateObjectId, authorizeRoles('Administrador'), assignTicket);
ticketsRouter.patch('/:id/status', validateObjectId, authorizeRoles('Administrador', 'Contratista'), updateTicketStatus);
ticketsRouter.post('/:id/replies', validateObjectId, addTicketReply);
ticketsRouter.delete('/:id', validateObjectId, authorizeRoles('Administrador'), deleteTicket);

module.exports = ticketsRouter;