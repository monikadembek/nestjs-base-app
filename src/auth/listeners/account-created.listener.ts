import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountCreatedEvent } from '../events/account-created.event';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AccountCreatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('auth.account-created')
  handleAccountCreatedEvent(event: AccountCreatedEvent) {
    this.emailService.sendAccountCreationConfirmationEmail(
      event.userEmail,
      event.userName,
    );
  }
}
