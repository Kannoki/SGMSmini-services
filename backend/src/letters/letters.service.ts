import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateLetterInput } from './dto/create-letter.input';
import { UpdateLetterInput } from './dto/update-letter.input';

@Injectable()
export class LettersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async findAll() {
    const rows = await this.prisma.letter.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((r) => ({
      ...r,
      recipientEmails: JSON.parse(r.recipientEmails || '[]') as string[],
    }));
  }

  async findOne(id: string) {
    const row = await this.prisma.letter.findUnique({ where: { id } });
    if (!row) return null;
    return {
      ...row,
      recipientEmails: JSON.parse(row.recipientEmails || '[]') as string[],
    };
  }

  async create(input: CreateLetterInput) {
    const row = await this.prisma.letter.create({
      data: {
        subject: input.subject,
        body: input.body,
        recipientEmails: JSON.stringify(input.recipientEmails || []),
      },
    });
    return {
      ...row,
      recipientEmails: JSON.parse(row.recipientEmails || '[]') as string[],
    };
  }

  async update(id: string, input: UpdateLetterInput) {
    const data: Record<string, unknown> = {};
    if (input.subject != null) data.subject = input.subject;
    if (input.body != null) data.body = input.body;
    if (input.recipientEmails != null) data.recipientEmails = JSON.stringify(input.recipientEmails);
    const row = await this.prisma.letter.update({
      where: { id },
      data,
    });
    return {
      ...row,
      recipientEmails: JSON.parse(row.recipientEmails || '[]') as string[],
    };
  }

  async remove(id: string) {
    await this.prisma.letter.delete({ where: { id } });
    return true;
  }

  async sendNow(letterId: string, recipients?: string[]) {
    const letter = await this.findOne(letterId);
    if (!letter) throw new Error('Letter not found');
    const to = recipients && recipients.length > 0 ? recipients : letter.recipientEmails;
    if (!to || to.length === 0) throw new Error('No recipients specified');
    const result = await this.mail.sendMail({
      to,
      subject: letter.subject,
      html: letter.body,
    });
    const status = result.success ? 'SENT' : 'FAILED';
    await this.prisma.letter.update({
      where: { id: letterId },
      data: { status },
    });
    return { success: result.success, error: result.error };
  }
}
