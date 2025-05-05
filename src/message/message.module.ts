import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
    UserModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
