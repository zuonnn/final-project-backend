import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { NotificationRepositoryInterface } from 'src/modules/notifications/interfaces/notification.interface';
import { InventoriesService } from '../inventories/inventories.service';

@Injectable()
export class NotificationsService extends BaseServiceAbstract<Notification>{
  constructor(
    @Inject('NotificationsRepositoryInterface') private readonly notificationRepository: NotificationRepositoryInterface,
  ) {
    super(notificationRepository);
  }
  async pushNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    let noti_content = '';
    if (createNotificationDto.noti_type === 'ORDER-001') {
      noti_content = 'Your order has been successfully placed';
    } else if (createNotificationDto.noti_type === 'ORDER-002') {
      noti_content = 'Your order has failed';
    }
    return await this.notificationRepository.create({
      ...createNotificationDto,
      noti_content
    });
  }
}
