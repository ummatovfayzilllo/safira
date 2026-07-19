import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  checkExistsResurs,
} from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const result = await this.prisma.contact.create({
      data: createContactDto,
    });

    return {
      message: 'This action adds a new contact',
      data: result,
    };
  }

  async findAll() {
    const result = await this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: `This action returns all contact`,
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.contact.findFirst({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Contact message not found (id: ${id})`);
    }

    return {
      message: `This action returns a #${id} contact`,
      data: result,
    };
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.CONTACT,
      'id',
      id,
    );

    const result = await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });

    return {
      message: `This action updates a #${id} contact`,
      data: result,
    };
  }

  async remove(id: string) {
    await checkExistsResurs(
      this.prisma,
      ModelsEnumInPrisma.CONTACT,
      'id',
      id,
    );

    const result = await this.prisma.contact.delete({
      where: { id },
    });

    return {
      message: `This action removes a #${id} contact`,
      data: result,
    };
  }
}
