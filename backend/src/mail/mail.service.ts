import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      const user = process.env.GMAIL_USER;
      const pass = process.env.GMAIL_APP_PASSWORD;
      if (!user || !pass) {
        throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set in .env');
      }
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
    return this.transporter;
  }

  async sendMail(options: {
    to: string[];
    subject: string;
    html: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: options.to.join(', '),
        subject: options.subject,
        html: options.html,
      });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }
}
