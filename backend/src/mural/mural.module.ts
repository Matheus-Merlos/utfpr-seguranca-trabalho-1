import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuralController } from './mural.controller';
import { MuralService } from './mural.service';
import { Recado } from '../entities/recado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recado])],
  controllers: [MuralController],
  providers: [MuralService],
})
export class MuralModule {}
