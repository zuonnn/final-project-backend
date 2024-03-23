import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { Comment } from './entities/comment.entity';
import { CommentRepositoryInterface } from './interfaces/comment.interface';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment>{
  constructor(
    @Inject('CommentsRepositoryInterface') private readonly commentRepository: CommentRepositoryInterface
  ) {
    super(commentRepository);
  }
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    let right: number;

    if (createCommentDto.comment_parent_id) {
      const parent = await this.commentRepository.findOneById(createCommentDto.comment_parent_id);


      if (!parent) {
        throw new NotFoundException('Comment parent not found');
      }

      right = parent.comment_right;

      await this.commentRepository.updateManyComments({ comment_product_id: createCommentDto.comment_product_id, parent })

    } else {
      const maxRight = await this.commentRepository.findByProductId({ comment_product_id: createCommentDto.comment_product_id })
      if (maxRight) {
        right = maxRight.comment_right + 1;
      } else {
        right = 1;
      }
    }
    const comment_left = right;
    const comment_right = right + 1;
    return await this.commentRepository.create({
      ...createCommentDto,
      comment_left,
      comment_right
    });
  }

  async getAllComments({
    comment_product_id,
    comment_parent_id,
    limit = 50,
    offset = 1
  }): Promise<Comment[]> {
    if (comment_parent_id) {
      const parent = await this.commentRepository.findOneById(comment_parent_id);
      if (!parent) {
        throw new NotFoundException('Comment parent not found');
      }
      return await this.commentRepository.findByParentId({ comment_product_id, comment_left: parent.comment_left, comment_right: parent.comment_right });
    }
    return await this.commentRepository.findAllParentComments({ comment_product_id });
  }

  async deleteComment(id: string) {
    console.log(id);
    const comment = await this.commentRepository.findOneById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    console.log(comment);
    const comment_left = comment.comment_left;
    const comment_right = comment.comment_right;
    const comment_product_id = comment.comment_product_id;

    const width = comment_right - comment_left + 1;

    this.commentRepository.deleteManyComments({ comment_product_id, comment_left, comment_right });
    this.commentRepository.updateManyCommentsAfterDelete({ comment_product_id, comment_right, width });
    return true;
  }
}
