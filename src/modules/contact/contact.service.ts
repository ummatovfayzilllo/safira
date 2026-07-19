import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const result = await this.prisma.contact.create({ data: createContactDto });
    return {
      message: 'This action adds a new contact',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.contact.findMany();

    return {
      message: `This action returns all contact`,
      data: result,
    };
  }

  async findOne(id: number) {
    if (!(await this.prisma.contact.findFirst({ where: { id: id } }))) {
      throw new NotFoundException('Contact message not found ');
    }
    const result = await this.prisma.contact.findFirst({ where: { id: id } });

    return {
      message: `This action returns a #${id} contact`,
      data: result,
    };
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    if (!(await this.prisma.contact.findFirst({ where: { id: id } }))) {
      throw new NotFoundException('Contact message not found ');
    }

    const result = await this.prisma.contact.update({
      where: { id: id },
      data: updateContactDto,
    });

    return {
      message: `This action updates a #${id} contact`,
      data: result,
    };
  }

  async remove(id: number) {
    if (!(await this.prisma.contact.findFirst({ where: { id: id } }))) {
      throw new NotFoundException('Contact message not found ');
    }

    const result = await this.prisma.contact.delete({ where: { id: id } });
    return {
      message: `This action removes a #${id} contact`,
      data: result,
    };
  }
}
