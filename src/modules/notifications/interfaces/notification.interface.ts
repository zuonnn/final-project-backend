import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { Notification } from "../entities/notification.entity";

export interface NotificationRepositoryInterface extends BaseRepositoryInterface<Notification> {
}