import { z } from 'zod'

export const verificationDecisionSchema = z
  .object({
    observationId: z.uuid(),
    decision: z.enum(['verified', 'revision_required', 'rejected'], 'Pilih keputusan.'),
    note: z.string().trim().max(500, 'Catatan maksimal 500 karakter.').optional(),
  })
  .refine((value) => value.decision === 'verified' || (value.note?.length ?? 0) > 0, {
    message: 'Tulis catatan agar kontributor tahu yang perlu diperbaiki.',
    path: ['note'],
  })

export type VerificationDecision = z.infer<typeof verificationDecisionSchema>
