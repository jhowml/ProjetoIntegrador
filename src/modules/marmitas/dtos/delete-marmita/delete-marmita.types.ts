import { z } from 'zod';
import { deleteMarmitaParamsSchema } from './delete-marmita.dto';

export type DeleteMarmitaParams = z.infer<typeof deleteMarmitaParamsSchema>;
