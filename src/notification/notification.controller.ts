import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseNotificationDto } from './dto/response-notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
@TransformDTO(ResponseNotificationDto)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(@CurrentUser() currentUser: IUserPayload) {
    return this.notificationService.findAll(currentUser);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }
}
