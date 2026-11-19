import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { BoletimModule } from './boletim/boletim.module';
import { NotasModule } from './notas/notas.module';
import { MuralModule } from './mural/mural.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'sigacad',
      password: process.env.DB_PASSWORD || 'sigacad',
      database: process.env.DB_NAME || 'sigacad',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsuariosModule,
    DisciplinasModule,
    BoletimModule,
    NotasModule,
    MuralModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
