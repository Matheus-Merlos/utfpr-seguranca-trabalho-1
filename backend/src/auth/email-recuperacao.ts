import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailRecuperacao {
  private readonly logger = new Logger(EmailRecuperacao.name);
  private readonly transporte = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    requireTLS: process.env.NODE_ENV === 'production',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  verificarConfiguracao() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
      throw new ServiceUnavailableException('Recuperação de senha indisponível');
    }
  }

  enviar(email: string, token: string) {
    // A resposta pública independe da latência do servidor SMTP e da existência da conta.
    void this.transporte.sendMail({
      from: process.env.SMTP_FROM,
      to: { name: '', address: email },
      subject: 'Recuperação de senha do SIGAcad',
      text: `No SIGAcad, abra “Esqueci minha senha” e depois “Já tenho um código”.\n\n${token}\n\nEste código vale por 15 minutos e pode ser usado uma vez.`,
    }).catch(() => this.logger.error('Falha ao entregar o e-mail de recuperação'));
  }
}
