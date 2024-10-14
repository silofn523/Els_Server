import { KakaoService } from './kakao.service'
import { KakaoController } from './kakao.controller'
import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { KakaoStrategy } from './kakao.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'kakao' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'JWT')
      })
    }),
    UserModule
  ],
  controllers: [KakaoController],
  providers: [KakaoService, KakaoStrategy],
  exports: [KakaoService]
})
export class KakaoModule {}
