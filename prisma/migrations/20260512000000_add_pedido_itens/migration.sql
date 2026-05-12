-- DropForeignKey
ALTER TABLE `Pedidos` DROP FOREIGN KEY `Pedidos_marmitasIdMarmita_fkey`;

-- AlterTable
ALTER TABLE `Pedidos` DROP COLUMN `quantidadeMarmitas`,
    DROP COLUMN `marmitasIdMarmita`;

-- CreateTable
CREATE TABLE `PedidoItens` (
    `idPedidoItem` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `precoUnitario` DECIMAL(10, 2) NOT NULL,
    `pedidosIdPedidos` INTEGER NOT NULL,
    `marmitasIdMarmita` INTEGER NOT NULL,

    PRIMARY KEY (`idPedidoItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PedidoItens` ADD CONSTRAINT `PedidoItens_pedidosIdPedidos_fkey` FOREIGN KEY (`pedidosIdPedidos`) REFERENCES `Pedidos`(`idPedidos`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItens` ADD CONSTRAINT `PedidoItens_marmitasIdMarmita_fkey` FOREIGN KEY (`marmitasIdMarmita`) REFERENCES `Marmitas`(`idMarmita`) ON DELETE RESTRICT ON UPDATE CASCADE;
