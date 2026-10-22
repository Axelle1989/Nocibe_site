import { prisma } from '../config/prisma.js';

interface LogAdminActionParams {
  adminId?: string;
  action: string;
  targetResource: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export const auditService = {
  async log(params: LogAdminActionParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: params.adminId || null,
          action: params.action,
          targetResource: params.targetResource,
          targetId: params.targetId || null,
          details: params.details ? (params.details as any) : undefined,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (err) {
      console.error('AuditLog error:', err);
    }
  },
};
