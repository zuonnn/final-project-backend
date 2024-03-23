import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll(@Query() query) { 
    return this.commentsService.getAllComments({
      comment_product_id: query.productId,
      comment_parent_id: query.parentId,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}
