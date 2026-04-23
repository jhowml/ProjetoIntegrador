import { findMarmitaById, countPedidosByMarmita, deleteMarmita } from '@/modules/marmitas/repositories/marmita.repository';

export type DeleteMarmitaPorts = {
  findMarmitaById: typeof findMarmitaById;
  countPedidosByMarmita: typeof countPedidosByMarmita;
  deleteMarmita: typeof deleteMarmita;
};
