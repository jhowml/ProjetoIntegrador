-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(16) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(32) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `idClientes` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `telefone` VARCHAR(45) NOT NULL,
    `endereco` VARCHAR(45) NULL,
    `obs` VARCHAR(100) NULL,

    PRIMARY KEY (`idClientes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marmitas` (
    `idMarmita` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `precoBase` DECIMAL(10, 2) NOT NULL,
    `adicionalEmbalagem` DECIMAL(2, 2) NOT NULL,
    `peso` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`idMarmita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedidos` (
    `idPedidos` INTEGER NOT NULL AUTO_INCREMENT,
    `dataPedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    `dataEntrega` DATE NULL,
    `quantidadeMarmitas` INTEGER NOT NULL,
    `valorTotal` DECIMAL(10, 2) NOT NULL,
    `clientesIdClientes` INTEGER NOT NULL,
    `marmitasIdMarmita` INTEGER NOT NULL,

    PRIMARY KEY (`idPedidos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `idPagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX') NOT NULL,
    `status` ENUM('PENDENTE', 'PAGO', 'ESTORNADO') NOT NULL,
    `valorPago` DECIMAL(10, 2) NOT NULL,
    `dataHoraPagamento` DATETIME(3) NOT NULL,
    `pedidosIdPedidos` INTEGER NOT NULL,

    UNIQUE INDEX `Pagamento_pedidosIdPedidos_key`(`pedidosIdPedidos`),
    PRIMARY KEY (`idPagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_clientesIdClientes_fkey` FOREIGN KEY (`clientesIdClientes`) REFERENCES `Clientes`(`idClientes`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_marmitasIdMarmita_fkey` FOREIGN KEY (`marmitasIdMarmita`) REFERENCES `Marmitas`(`idMarmita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_pedidosIdPedidos_fkey` FOREIGN KEY (`pedidosIdPedidos`) REFERENCES `Pedidos`(`idPedidos`) ON DELETE RESTRICT ON UPDATE CASCADE;
