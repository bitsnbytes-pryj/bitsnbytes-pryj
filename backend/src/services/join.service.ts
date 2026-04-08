import { supabase } from '../config/supabase.js';
import { JoinInput, RequestMeta } from '../types/index.js';
import { sendFormEmails } from './email.service.js';
import { logger } from '../utils/logger.js';

export async function createJoinApplication(
  input: JoinInput,
  meta: RequestMeta
): Promise<{ id: string }> {
  // Insert into database
  const { data, error } = await supabase
    .from('join_applications')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      interests: input.interests,
      experience: input.experience,
      why_join: input.why_join,
      how_heard: input.how_heard,
      ip_address: meta.ip_address,
      user_agent: meta.user_agent,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to save join application', { error: error.message });
    throw new Error('Failed to save join application');
  }

  // Send emails (non-blocking)
  sendFormEmails(
    'Join Application',
    {
      Name: input.name,
      Email: input.email,
      Phone: input.phone || 'Not provided',
      Interests: input.interests?.join(', ') || 'Not specified',
      Experience: input.experience || 'Not specified',
      'Why Join': input.why_join,
      'How Heard': input.how_heard,
    },
    input.email,
    input.name
  ).catch((err) => {
    logger.error('Email sending failed for join application', { error: err });
  });

  return { id: data.id };
}