import { Module } from '@nestjs/common'
import { DataService } from './data.service'
import { DataController } from './data.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Datum } from './entities/datum.entity'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Datum]), UserModule],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule {}
