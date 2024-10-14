import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-kakao'

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_RESTAPI_KEY'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_PW'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
      scope: ['profile_nickname', 'profile_image', 'account_email']
    })
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account'
    }
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) {
    try {
      const {
        id,
        displayName,
        provider,
        _json: { kakao_account }
      } = profile

      const email = kakao_account.email || null
      const profileUrl = kakao_account.profile.profile_image_url || null

      const user = {
        id: id,
        provider: provider,
        profileUrl: profileUrl,
        name: displayName,
        email: email,
        accessToken,
        refreshToken
      }

      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }
}
