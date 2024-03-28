import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { NotificationRepositoryInterface } from 'src/modules/notifications/interfaces/notification.interface';

@Injectable()
export class NotificationsRepository
    extends BaseRepositoryAbstract<Notification>
    implements NotificationRepositoryInterface {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
    ) {
        super(notificationModel);
    }

    
}
