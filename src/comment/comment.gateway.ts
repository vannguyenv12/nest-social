import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseCommentDto } from './dto/response-comment.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  handleCommentCreate(postId: string, responseCommentDto: ResponseCommentDto) {
    console.log({ postId, responseCommentDto });

    this.server.emit('comment_created', {
      postId,
      comment: responseCommentDto,
    });
  }
}
