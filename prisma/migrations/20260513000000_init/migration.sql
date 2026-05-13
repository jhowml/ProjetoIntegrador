-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'ESTORNADO');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(32) NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "idClientes" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "telefone" VARCHAR(45) NOT NULL,
    "endereco" VARCHAR(45),
    "obs" VARCHAR(100),

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("idClientes")
);

-- CreateTable
CREATE TABLE "Marmitas" (
    "idMarmita" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "precoBase" DECIMAL(10,2) NOT NULL,
    "adicionalEmbalagem" DECIMAL(2,2) NOT NULL,
    "peso" DECIMAL(10,2) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Marmitas_pkey" PRIMARY KEY ("idMarmita")
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "idPedidos" SERIAL NOT NULL,
    "dataPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "dataEntrega" DATE,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "clientesIdClientes" INTEGER NOT NULL,

    CONSTRAINT "Pedidos_pkey" PRIMARY KEY ("idPedidos")
);

-- CreateTable
CREATE TABLE "PedidoItens" (
    "idPedidoItem" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DECIMAL(10,2) NOT NULL,
    "pedidosIdPedidos" INTEGER NOT NULL,
    "marmitasIdMarmita" INTEGER NOT NULL,

    CONSTRAINT "PedidoItens_pkey" PRIMARY KEY ("idPedidoItem")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "idPagamento" SERIAL NOT NULL,
    "tipo" "TipoPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL,
    "valorPago" DECIMAL(10,2) NOT NULL,
    "dataHoraPagamento" TIMESTAMP(3) NOT NULL,
    "pedidosIdPedidos" INTEGER NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("idPagamento")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_pedidosIdPedidos_key" ON "Pagamento"("pedidosIdPedidos");

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_clientesIdClientes_fkey" FOREIGN KEY ("clientesIdClientes") REFERENCES "Clientes"("idClientes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItens" ADD CONSTRAINT "PedidoItens_pedidosIdPedidos_fkey" FOREIGN KEY ("pedidosIdPedidos") REFERENCES "Pedidos"("idPedidos") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItens" ADD CONSTRAINT "PedidoItens_marmitasIdMarmita_fkey" FOREIGN KEY ("marmitasIdMarmita") REFERENCES "Marmitas"("idMarmita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_pedidosIdPedidos_fkey" FOREIGN KEY ("pedidosIdPedidos") REFERENCES "Pedidos"("idPedidos") ON DELETE RESTRICT ON UPDATE CASCADE;
