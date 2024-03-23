import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Comment } from "../entities/comment.entity";


export interface CommentRepositoryInterface extends BaseRepositoryInterface<Comment> {
    updateManyComments({ comment_product_id, parent }): Promise<void>;
    findByProductId({ comment_product_id }): Promise<Comment>;
    findByParentId({ comment_product_id, comment_left, comment_right }): Promise<Comment[]>;
    findAllParentComments({ comment_product_id }): Promise<Comment[]>;
    deleteManyComments({ comment_product_id, comment_left, comment_right }): void;
    updateManyCommentsAfterDelete({ comment_product_id, comment_right, width }): void;
}