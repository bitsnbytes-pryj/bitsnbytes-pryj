import { Router } from 'express';
import {
  listContactsController, getContactController, deleteContactController,
  listJoinApplicationsController, getJoinApplicationController, deleteJoinApplicationController,
  listEventRegistrationsController, getEventRegistrationController, deleteEventRegistrationController,
  listRoleApplicationsController, getRoleApplicationController, deleteRoleApplicationController,
  listFeedbackController, getFeedbackController, deleteFeedbackController,
} from '../controllers/submissions.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// Contacts
router.get('/contacts', listContactsController);
router.get('/contacts/:id', getContactController);
router.delete('/contacts/:id', deleteContactController);

// Join Applications
router.get('/join-applications', listJoinApplicationsController);
router.get('/join-applications/:id', getJoinApplicationController);
router.delete('/join-applications/:id', deleteJoinApplicationController);

// Event Registrations
router.get('/event-registrations', listEventRegistrationsController);
router.get('/event-registrations/:id', getEventRegistrationController);
router.delete('/event-registrations/:id', deleteEventRegistrationController);

// Role Applications
router.get('/role-applications', listRoleApplicationsController);
router.get('/role-applications/:id', getRoleApplicationController);
router.delete('/role-applications/:id', deleteRoleApplicationController);

// Feedback
router.get('/feedback', listFeedbackController);
router.get('/feedback/:id', getFeedbackController);
router.delete('/feedback/:id', deleteFeedbackController);

export default router;