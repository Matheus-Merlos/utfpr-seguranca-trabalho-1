import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletimController } from './boletim.controller';
import { BoletimService } from './boletim.service';
import { Matricula } from '../entities/matricula.entity';
import { Nota } from '../entities/nota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Matricula, Nota])],
  controllers: [BoletimController],
  providers: [BoletimService],
})
export class BoletimModule {}
