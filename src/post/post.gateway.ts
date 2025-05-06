import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ResponsePostDto } from './dto/response-post.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class PostGateway {
  @WebSocketServer()
  server: Server; // === io

  handlePostCreate(data: ResponsePostDto) {
    this.server.emit('post_created', data);
  }
}
