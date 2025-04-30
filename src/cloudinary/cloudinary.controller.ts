import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // https://res.cloudinary.com/dir7wnely/image/upload/v1745998484/mlckh5qvjyrczdczvigr.jpg
    const result = await this.cloudinaryService.uploadFile(file);

    return {
      message: 'success',
      data: {
        url: result.secure_url,
        version: result.version,
        display_name: result.display_name,
        format: result.format,
        resource_type: result.resource_type,
      },
    };
  }
}
