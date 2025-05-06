import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseCommentDto } from './dto/response-comment.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  handleCommentCreate(postId: string, responseCommentDto: ResponseCommentDto) {
    this.server.emit('comment_created', {
      postId,
      comment: responseCommentDto,
    });
  }

  handleCommentUpdate(commentId: string, content: string, updatedAt: Date) {
    console.log({ commentId, content, updatedAt });

    this.server.emit('comment_updated', { commentId, content, updatedAt });
  }

  handleCommentRemove(commentId: string, parentId: string | null) {
    this.server.emit('comment_delete', { commentId, parentId });
  }
}
