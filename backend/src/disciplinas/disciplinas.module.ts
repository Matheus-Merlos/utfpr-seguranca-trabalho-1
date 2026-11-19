import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinasController } from './disciplinas.controller';
import { DisciplinasService } from './disciplinas.service';
import { Disciplina } from '../entities/disciplina.entity';
import { Matricula } from '../entities/matricula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disciplina, Matricula])],
  controllers: [DisciplinasController],
  providers: [DisciplinasService],
  exports: [DisciplinasService],
})
export class DisciplinasModule {}
