import { HttpException, Injectable } from '@nestjs/common';
import { CreateMentorProfileDto } from './dto/create-mentor_profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor_profile.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/utils/check.functions';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { userFindOneEntity } from '../users/entities/user.entity';

@Injectable()
export class MentorProfilesService {

  constructor(
    private readonly prisma : PrismaService,
    private readonly config : ConfigService
  ){}

  async create(data: CreateMentorProfileDto) {
    await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.MENTOR_PROFILES,"userId",data.userId)
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"id",data.userId)
    const newMentorProfile = await this.prisma.mentorProfile.create({
      data : {...data},
      include : {
        user : {select : userFindOneEntity}
      }
    })  
    return {
      message : 'This action adds a new mentorProfile',
      data : newMentorProfile
    };
  }

  async findAll() {
    const mentorProfiles = await this.prisma.mentorProfile.findMany({
      include : {user : {select : userFindOneEntity}}
    })
    return {
      message  : `This action returns all mentorProfiles`,
      data : mentorProfiles
    };
  }

  async findOne(id: string) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.MENTOR_PROFILES,"id",id)
    const result = await this.prisma.mentorProfile.findMany({include : {user : {select : userFindOneEntity}}})
    return {
      message : `This action returns a #${id} mentorProfile`,
      data : result
    };
  }

  async update(id: string, updateMentorProfileDto: UpdateMentorProfileDto) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.MENTOR_PROFILES,"id",id)
    try {
      const result =  await this.prisma.mentorProfile.update({
        where : {id:id},
        data : updateMentorProfileDto,
        include : {user : {select : userFindOneEntity}}
      })
      return {
        message : `This action updates a #${id} mentorProfile`,
        data : result
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("MentorPrfile updated filed !",500)
    }
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.MENTOR_PROFILES,"id",id)
    try {
      const deleted = await this.prisma.mentorProfile.delete({where : {id : id },include : {user : {select : userFindOneEntity}}})
      return {
        message : `This action removes a #${id} mentorProfile`,
        data : deleted
      };
    } catch (error) {
      throw new HttpException("MentorProfile delete  filed ",500)
    }
  }
}
