import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseMessageDto } from './dto/response-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server; // === io

  // === io.on('connection')
  handleConnection(client: Socket) {
    console.log(`Client connect ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() conversationId: string, // FE
    @ConnectedSocket() client: Socket, // === socket
  ) {
    await client.join(conversationId);
  }

  handleNewMessage(conversationId: string, data: ResponseMessageDto) {
    console.log('check data from socket', data);

    this.server.to(conversationId).emit('new_message', data);
  }
}
