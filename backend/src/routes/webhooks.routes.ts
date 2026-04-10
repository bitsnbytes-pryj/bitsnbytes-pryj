import { Router, Request, Response } from 'express';
import { supabase } from '../db/index.js';
import { config } from '../config/index.js';

const router = Router();

// Webhook API key middleware
const validateWebhookKey = (req: Request, res: Response, next: Function): void => {
  const apiKey = req.headers['x-webhook-key'];
  
  if (!apiKey || apiKey !== config.webhookApiKey) {
    res.status(401).json({
      success: false,
      error: 'Invalid webhook API key',
    });
    return;
  }
  next();
};

// Apply webhook auth to all routes
router.use(validateWebhookKey);

// ============ CONTACT FORM ============

router.post('/forms/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required',
      });
    }
    
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        subject,
        message,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Contact webhook error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit contact form' });
  }
});

// ============ JOIN APPLICATION ============

router.post('/forms/join', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, interests, experience, whyJoin, howHeard } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }
    
    const { data, error } = await supabase
      .from('join_applications')
      .insert({
        name,
        email,
        phone,
        interests: interests || [],
        experience,
        why_join: whyJoin,
        how_heard: howHeard,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Join webhook error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit join application' });
  }
});

// ============ EVENT REGISTRATION ============

router.post('/forms/event-register', async (req: Request, res: Response) => {
  try {
    const { eventId, name, email, phone, organization, specialRequirements } = req.body;
    
    if (!eventId || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Event ID, name, and email are required',
      });
    }
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        name,
        email,
        phone,
        organization,
        special_requirements: specialRequirements,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'You have already registered for this event',
        });
      }
      throw error;
    }
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Event registration webhook error:', error);
    return res.status(500).json({ success: false, error: 'Failed to register for event' });
  }
});

// ============ ROLE APPLICATION ============

router.post('/forms/role-apply', async (req: Request, res: Response) => {
  try {
    const { roleId, name, email, phone, portfolioUrl, resumeUrl, coverLetter, linkedinUrl, availability } = req.body;
    
    if (!roleId || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Role ID, name, and email are required',
      });
    }
    
    const { data, error } = await supabase
      .from('role_applications')
      .insert({
        role_id: roleId,
        name,
        email,
        phone,
        portfolio_url: portfolioUrl,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        linkedin_url: linkedinUrl,
        availability,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Role application webhook error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit role application' });
  }
});

// ============ FEEDBACK ============

router.post('/forms/feedback', async (req: Request, res: Response) => {
  try {
    const { name, email, feedbackType, message, rating } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        name,
        email,
        feedback_type: feedbackType || 'general',
        message,
        rating,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Feedback webhook error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

export default router;