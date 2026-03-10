import { Module } from '@nestjs/common';
import { LettersService } from './letters.service';
import { LettersResolver } from './letters.resolver';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [LettersService, LettersResolver],
})
export class LettersModule {}
