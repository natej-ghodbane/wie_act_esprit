import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Multer configuration for file uploads
/*
const storage = diskStorage({
  destination: './uploads/profiles',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});
*/

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /*@Post(':id/upload-profile-image')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const imagePath = `/uploads/profiles/${file.filename}`;
    return this.usersService.updateProfileImage(id, imagePath);
  }
  */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.usersService.getUserStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.usersService.findOne(req.user._id || req.user.id);
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user profile');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}