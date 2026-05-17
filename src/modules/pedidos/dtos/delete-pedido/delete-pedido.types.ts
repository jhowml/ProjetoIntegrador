import { z } from 'zod';
import { deletePedidoParamsSchema } from './delete-pedido.dto';

export type DeletePedidoParams = z.infer<typeof deletePedidoParamsSchema>;
