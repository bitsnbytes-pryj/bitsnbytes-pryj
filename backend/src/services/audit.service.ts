import { supabase } from '../db/index.js';

interface AuditLogData {
  adminUserId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      admin_user_id: data.adminUserId,
      action: data.action,
      entity_type: data.entityType,
      entity_id: data.entityId,
      details: data.details,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}

export async function getAuditLogs(options: {
  limit?: number;
  offset?: number;
  adminUserId?: string;
  action?: string;
  entityType?: string;
}) {
  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      admin_user:admin_users(id, email, name, role)
    `)
    .order('created_at', { ascending: false });
  
  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  if (options.adminUserId) query = query.eq('admin_user_id', options.adminUserId);
  if (options.action) query = query.eq('action', options.action);
  if (options.entityType) query = query.eq('entity_type', options.entityType);
  
  return query;
}