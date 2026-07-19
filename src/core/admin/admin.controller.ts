import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { Permission, Public } from 'src/global/decorators/auth.decorators';
import { PermissionService } from './permission/permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission';

@Controller('admin')
@Public()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly permissionService: PermissionService,
  ) {}

  @Post('new-user')
  createNewUser(@Body() createNewUserDto: CreateNewUserDto) {
    return this.adminService.createNewUser(createNewUserDto);
  }

  @Post('assign-role')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('create-permission')
  createPermission(@Body() data: CreatePermissionDto) {
    return this.permissionService.create(data);
  }

  @Put('update-permission/:permissionId')
  updatePermission(
    @Body() data: UpdatePermissionDto,
    @Param('permissionId') id: string,
  ) {
    return this.permissionService.update(id, data);
  }

  @Get('getall-staff')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('getOne-staff/:staffId')
  findOne(@Param('staffId') id: string) {
    return this.adminService.findOne(id);
  }

  @Delete('delete-staff/:staffId')
  remove(@Param('staffId') id: string) {
    return this.adminService.remove(id);
  }

  @Delete('delete-permission/:permissionId')
  deletePermissionByPermissionId(@Param('permissionId') permissionId: string) {
    return this.permissionService.remove(permissionId);
  }
}
