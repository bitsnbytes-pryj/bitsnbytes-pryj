import { supabase } from '../db/index.js';

export interface AuditLogInput {
  adminUserId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        admin_user_id: input.adminUserId,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        details: input.details,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
      });
    
    if (error) {
      console.error('Failed to log audit:', error);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}