import { supabase } from '../config/supabase.js';
import { ContactInput, RequestMeta } from '../types/index.js';
import { sendFormEmails } from './email.service.js';
import { logger } from '../utils/logger.js';

export async function createContact(
  input: ContactInput,
  meta: RequestMeta
): Promise<{ id: string }> {
  // Insert into database
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      ip_address: meta.ip_address,
      user_agent: meta.user_agent,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to save contact', { error: error.message });
    throw new Error('Failed to save contact submission');
  }

  // Send emails (non-blocking)
  sendFormEmails(
    'Contact Form',
    {
      Name: input.name,
      Email: input.email,
      Subject: input.subject,
      Message: input.message,
    },
    input.email,
    input.name
  ).catch((err) => {
    logger.error('Email sending failed for contact', { error: err });
  });

  return { id: data.id };
}