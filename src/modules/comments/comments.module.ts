import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { CommentsRepository } from './repositories/comment.repository';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: 'CommentsRepositoryInterface', useClass: CommentsRepository }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    
  ],

})
export class CommentsModule {}
