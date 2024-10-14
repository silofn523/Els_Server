import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigurationModule } from './configuration/configuration.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleModule } from './google/google.module'
import { KakaoModule } from './kakao/kakao.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { DataModule } from './data/data.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_SCHEMA'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('TYPEORM_SYBCHRONIZE')
      })
    }),
    ConfigurationModule,
    UserModule,
    GoogleModule,
    KakaoModule,
    DataModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
