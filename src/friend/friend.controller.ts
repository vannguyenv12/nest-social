import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-object-id.pipe';
import { AuthGuard } from 'src/_cores/guards/auth.guard';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @HttpCode(200)
  @Post('/request/:receiverId')
  sendFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    @Param('receiverId', ParseObjectIdPipe) receiverId: string,
  ) {
    return this.friendService.create(currentUser, receiverId);
  }

  @HttpCode(200)
  @Post('/cancel-request/:receiverId')
  cancelFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    @Param('receiverId', ParseObjectIdPipe) receiverId: string,
  ) {
    return this.friendService.remove(currentUser, receiverId);
  }

  @HttpCode(200)
  @Post('/accept-request/:friendRequestId')
  acceptFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    @Param('friendRequestId', ParseObjectIdPipe) friendRequestId: string,
  ) {
    return this.friendService.acceptFriendRequest(currentUser, friendRequestId);
  }

  @HttpCode(200)
  @Post('/reject-request/:friendRequestId')
  rejectFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    @Param('friendRequestId', ParseObjectIdPipe) friendRequestId: string,
  ) {
    return this.friendService.rejectFriendRequest(currentUser, friendRequestId);
  }

  @Get()
  getCurrentFriends(@CurrentUser() currentUser: IUserPayload) {
    return this.friendService.getCurrentFriends(currentUser);
  }

  @Get('/request-pending')
  getCurrentRequestPending(@CurrentUser() currentUser: IUserPayload) {
    return this.friendService.getCurrentRequestPending(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }
}
