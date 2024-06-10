import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sendInvitaitonMail(to: string, path: string) {
    try {
      await this.mailerService.sendMail({
        to,
        from: 'USM Beuvrages <no-reply@beuvrages.com>',
        subject: 'Quotes',
        html: `<p>${this.configService.get('BASE_URL') + path}</p>`,
      });
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  //   private async transport(mail: SendGrid.MailDataRequired) {
  //     const transport = await SendGrid.send(mail);
  //     this.logger.log(`mailer.transport: email send to ${mail.to}`);
  //     return transport;
  //   }
}
