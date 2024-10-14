import { Module } from '@nestjs/common'
import { GoogleService } from './google.service'
import { GoogleController } from './google.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from 'src/user/user.module'
import { GoogleStratagy } from './google.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'JWT')
      })
    }),
    UserModule
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStratagy]
})
export class GoogleModule {}
