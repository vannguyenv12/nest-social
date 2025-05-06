import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseFriendRequestDto } from './dto/response-request-friend.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId);
  }

  handleSendFriendRequest(receiverId: string, data: ResponseFriendRequestDto) {
    this.server.to(receiverId).emit('send_friend_request', data);
  }

  handleAcceptRequest(data: any) {
    this.server.to(data._id).emit('accept_friend', data);
  }
}

// John | id: 1 => join 1
// Thomas | id: 2 => join 2

// socket.on('connect', () => {
//   const currentUserId = localStorage;
//   socket.emit('join_room', currentUserId);
// });
