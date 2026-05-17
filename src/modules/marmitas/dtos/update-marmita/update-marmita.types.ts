import { z } from 'zod';
import { Marmita } from '@prisma/client';
import { updateMarmitaParamsSchema, updateMarmitaBodySchema } from './update-marmita.dto';

export type UpdateMarmitaParams = z.infer<typeof updateMarmitaParamsSchema>;
export type UpdateMarmitaBodyDTO = z.infer<typeof updateMarmitaBodySchema>;
export type UpdateMarmitaResult = Marmita;
