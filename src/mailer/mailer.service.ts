import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserRegistration(firstName: string, email: string) {
    const joinedAt = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log('sending...');
    console.log('Resolved template dir:', join(__dirname, 'templates'));

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Platform!',
      template: 'register',
      context: {
        firstName,
        joinedAt,
      },
    });
  }

  async sendForgotPassword(email: string, resetLink: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'forgot-password',
      context: {
        resetLink,
      },
    });
  }
}
