import { supabase } from '../config/supabase.js';
import { FeedbackInput, RequestMeta } from '../types/index.js';
import { sendFormEmails } from './email.service.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export async function createFeedback(
  input: FeedbackInput,
  meta: RequestMeta
): Promise<{ id: string }> {
  // Insert into database
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      name: input.name,
      email: input.email,
      feedback_type: input.feedback_type,
      message: input.message,
      rating: input.rating,
      ip_address: meta.ip_address,
      user_agent: meta.user_agent,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to save feedback', { error: error.message });
    throw new Error('Failed to save feedback');
  }

  // Send emails (non-blocking) - use admin email as fallback if user doesn't provide email
  sendFormEmails(
    'Feedback',
    {
      Name: input.name || 'Anonymous',
      Email: input.email || 'Not provided',
      Type: input.feedback_type,
      Rating: input.rating ? `${input.rating}/5` : 'Not provided',
      Message: input.message,
    },
    input.email || config.adminEmail,
    input.name || 'there'
  ).catch((err) => {
    logger.error('Email sending failed for feedback', { error: err });
  });

  return { id: data.id };
}