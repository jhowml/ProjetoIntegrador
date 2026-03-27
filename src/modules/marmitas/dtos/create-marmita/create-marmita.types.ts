import { Marmita } from '@prisma/client';
import { z } from 'zod';
import { createMarmitaSchema } from './create-marmita.dto';

export type CreateMarmitaDTO = z.infer<typeof createMarmitaSchema>;
export type CreateMarmitaResult = Marmita;
