import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as pug from 'pug';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAccountCreationConfirmationEmail(
    userEmail: string,
    userName: string,
  ) {
    const appName = 'NestJS App';
    const subject = `${appName} - account created`;

    const html = pug.renderFile(
      './dist/email/templates/account-creation-confirmation.pug',
      {
        appName,
        userName,
      },
    );

    await this.mailerService.sendMail({
      to: userEmail,
      subject,
      html,
    });
  }
}
