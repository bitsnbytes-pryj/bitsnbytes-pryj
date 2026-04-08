import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  listContacts, getContactById, deleteContact,
  listJoinApplications, getJoinApplicationById, deleteJoinApplication,
  listEventRegistrations, getEventRegistrationById, deleteEventRegistration,
  listRoleApplications, getRoleApplicationById, deleteRoleApplication,
  listFeedback, getFeedbackById, deleteFeedback,
} from '../services/submissions.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { listContactsQuerySchema, listJoinApplicationsQuerySchema, listEventRegistrationsQuerySchema, listRoleApplicationsQuerySchema, listFeedbackQuerySchema } from '../types/submissions.types.js';

// Contacts
export async function listContactsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listContactsQuerySchema.parse(req.query);
    const result = await listContacts(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List contacts error:', error);
    errorResponses.internalError(res, 'Failed to list contacts');
  }
}

export async function getContactController(req: Request, res: Response): Promise<void> {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) { errorResponses.notFound(res, 'Contact not found'); return; }
    successResponses.ok(res, contact);
  } catch (error) { console.error('Get contact error:', error); errorResponses.internalError(res, 'Failed to get contact'); }
}

export async function deleteContactController(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteContact(req.params.id);
    if (!deleted) { errorResponses.notFound(res, 'Contact not found'); return; }
    successResponses.noContent(res);
  } catch (error) { console.error('Delete contact error:', error); errorResponses.internalError(res, 'Failed to delete contact'); }
}

// Join Applications
export async function listJoinApplicationsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listJoinApplicationsQuerySchema.parse(req.query);
    const result = await listJoinApplications(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List join applications error:', error);
    errorResponses.internalError(res, 'Failed to list join applications');
  }
}

export async function getJoinApplicationController(req: Request, res: Response): Promise<void> {
  try {
    const app = await getJoinApplicationById(req.params.id);
    if (!app) { errorResponses.notFound(res, 'Join application not found'); return; }
    successResponses.ok(res, app);
  } catch (error) { console.error('Get join application error:', error); errorResponses.internalError(res, 'Failed to get join application'); }
}

export async function deleteJoinApplicationController(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteJoinApplication(req.params.id);
    if (!deleted) { errorResponses.notFound(res, 'Join application not found'); return; }
    successResponses.noContent(res);
  } catch (error) { console.error('Delete join application error:', error); errorResponses.internalError(res, 'Failed to delete join application'); }
}

// Event Registrations
export async function listEventRegistrationsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listEventRegistrationsQuerySchema.parse(req.query);
    const result = await listEventRegistrations(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List event registrations error:', error);
    errorResponses.internalError(res, 'Failed to list event registrations');
  }
}

export async function getEventRegistrationController(req: Request, res: Response): Promise<void> {
  try {
    const reg = await getEventRegistrationById(req.params.id);
    if (!reg) { errorResponses.notFound(res, 'Event registration not found'); return; }
    successResponses.ok(res, reg);
  } catch (error) { console.error('Get event registration error:', error); errorResponses.internalError(res, 'Failed to get event registration'); }
}

export async function deleteEventRegistrationController(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteEventRegistration(req.params.id);
    if (!deleted) { errorResponses.notFound(res, 'Event registration not found'); return; }
    successResponses.noContent(res);
  } catch (error) { console.error('Delete event registration error:', error); errorResponses.internalError(res, 'Failed to delete event registration'); }
}

// Role Applications
export async function listRoleApplicationsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listRoleApplicationsQuerySchema.parse(req.query);
    const result = await listRoleApplications(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List role applications error:', error);
    errorResponses.internalError(res, 'Failed to list role applications');
  }
}

export async function getRoleApplicationController(req: Request, res: Response): Promise<void> {
  try {
    const app = await getRoleApplicationById(req.params.id);
    if (!app) { errorResponses.notFound(res, 'Role application not found'); return; }
    successResponses.ok(res, app);
  } catch (error) { console.error('Get role application error:', error); errorResponses.internalError(res, 'Failed to get role application'); }
}

export async function deleteRoleApplicationController(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteRoleApplication(req.params.id);
    if (!deleted) { errorResponses.notFound(res, 'Role application not found'); return; }
    successResponses.noContent(res);
  } catch (error) { console.error('Delete role application error:', error); errorResponses.internalError(res, 'Failed to delete role application'); }
}

// Feedback
export async function listFeedbackController(req: Request, res: Response): Promise<void> {
  try {
    const query = listFeedbackQuerySchema.parse(req.query);
    const result = await listFeedback(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List feedback error:', error);
    errorResponses.internalError(res, 'Failed to list feedback');
  }
}

export async function getFeedbackController(req: Request, res: Response): Promise<void> {
  try {
    const fb = await getFeedbackById(req.params.id);
    if (!fb) { errorResponses.notFound(res, 'Feedback not found'); return; }
    successResponses.ok(res, fb);
  } catch (error) { console.error('Get feedback error:', error); errorResponses.internalError(res, 'Failed to get feedback'); }
}

export async function deleteFeedbackController(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await deleteFeedback(req.params.id);
    if (!deleted) { errorResponses.notFound(res, 'Feedback not found'); return; }
    successResponses.noContent(res);
  } catch (error) { console.error('Delete feedback error:', error); errorResponses.internalError(res, 'Failed to delete feedback'); }
}