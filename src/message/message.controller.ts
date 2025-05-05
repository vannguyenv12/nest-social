import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-object-id.pipe';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/conversation/:conversationId')
  sendMessage(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.messageService.sendMessage(
      conversationId,
      sendMessageDto,
      currentUser,
    );
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
