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

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string, // FE
    @ConnectedSocket() client: Socket, // === socket
  ): string {
    return data;
  }
}
