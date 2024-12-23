import { Module } from '@nestjs/common';
import { DataGateway } from './data.gateway';
import { DataService } from './data.service';
import { HeartbeatService } from '../utils/heartbeat.service';
import { DataModel } from './data.model';

@Module({
  providers: [DataGateway, DataService, HeartbeatService, DataModel],
})
export class DataModule {}
