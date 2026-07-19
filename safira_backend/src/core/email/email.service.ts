import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { messageGenerator } from 'src/common/utils/generators';

@Injectable()
export class EmailService {
  private email: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.email = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendResedPasswordVerify(
    email: string,
    code: number,
    typeMessage: EmailCodeEnum,
  ) {
    const emailUser = this.config.get('EMAIL_USER');
    const result = await this.email.sendMail({
      to: email,
      from: `Verfication Service : '<${emailUser}>'`,
      subject: 'Verfication Service : "<Edfix Tasdiq Kodi>"',
      text: `Salom sizning tasdiq kodingiz: ${code}`,
      html: messageGenerator(typeMessage, code),
    });

    return result;
  }
}
