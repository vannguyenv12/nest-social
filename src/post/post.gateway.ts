import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ResponsePostDto } from './dto/response-post.dto';
import { UploadMediaDto } from 'src/_cores/globals/dtos';

@WebSocketGateway({ cors: { origin: '*' } })
export class PostGateway {
  @WebSocketServer()
  server: Server; // === io

  handlePostCreate(data: ResponsePostDto) {
    this.server.emit('post_created', data);
  }

  handleUploadMedia(postId: string, uploadMediaDtos: UploadMediaDto[]) {
    this.server.emit('post_upload_media', {
      postId,
      mediaFiles: uploadMediaDtos,
    });
  }

  handleRemoveMedia(postId: string, mediaId: string) {
    this.server.emit('post_remove_media', {
      postId,
      mediaId,
    });
  }
}
