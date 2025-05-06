import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseFriendDto } from './dto/response-friend.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleEvent(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId);
  }

  handleSendFriendRequest(receiverId: string, data: ResponseFriendDto) {
    this.server.to(receiverId).emit('send_friend_request', data);
  }
}

// John | id: 1 => join 1
// Thomas | id: 2 => join 2

// socket.on('connect', () => {
//   const currentUserId = localStorage;
//   socket.emit('join_room', currentUserId);
// });
