import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './repositories/notification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './entities/notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    { provide: 'NotificationsRepositoryInterface', useClass: NotificationsRepository}
  ],
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
