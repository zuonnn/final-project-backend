import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { CommentRepositoryInterface } from 'src/modules/comments/interfaces/comment.interface';

@Injectable()
export class CommentsRepository
  extends BaseRepositoryAbstract<Comment>
  implements CommentRepositoryInterface {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }
  async updateManyComments({ comment_product_id, parent }): Promise<void> {
    await this.commentModel.updateMany({
      comment_product_id,
      comment_right: { $gte: parent.comment_right }
    }, {
      $inc: { comment_right: 2 }
    });

    await this.commentModel.updateMany({
      comment_product_id,
      comment_left: { $gt: parent.comment_right }
    }, {
      $inc: { comment_left: 2 }
    });
  }
  async findByProductId({ comment_product_id }): Promise<Comment> {
    return await this.commentModel.findOne({ comment_product_id }, 'comment_right', { sort: { comment_right: -1 } });
  }

  async findByParentId({ comment_product_id, comment_left, comment_right, }): Promise<Comment[]> {
    return await this.commentModel.find({
      comment_product_id,
      comment_left: { $gt: comment_left },
      comment_right: { $lte: comment_right }
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parent_id: 1,
      })
      .sort({ comment_left: 1 });
  }

  async findAllParentComments({ comment_product_id }): Promise<Comment[]> {
    return await this.commentModel.find({
      comment_product_id,
      comment_parent_id: null
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parent_id: 1,
      })
      .sort({ comment_left: 1 });
  }

  async deleteManyComments({ comment_product_id, comment_left, comment_right }): Promise<void> {
    await this.commentModel.deleteMany({
      comment_product_id,
      comment_left: { $gte: comment_left, $lte: comment_right }
    });
  }

  async updateManyCommentsAfterDelete({ comment_product_id, comment_right, width }): Promise<void> {
    await this.commentModel.updateMany({
      comment_product_id,
      comment_right: { $gt: comment_right }
    }, {
      $inc: { comment_right: -width }
    })

    await this.commentModel.updateMany({
      comment_product_id,
      comment_left: { $gt: comment_right }
    }, {
      $inc: { comment_left: -width }
    })
  }
}
