import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entitites/product.entity";
import { Module } from "@nestjs/common";
@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [],
    providers: [],
  })
  export class ProductsModule {}