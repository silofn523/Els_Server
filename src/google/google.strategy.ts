import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStratagy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    // super({
    //   clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
    //   callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
    //   scope: ['email', 'profile']
    // })
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_PW'),
      callbackURL: configService.get<string>('GOOGLE_URL'),
      scope: ['email', 'profile']
    })
  }

  // refreshToken 발급
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
    done: VerifyCallback
  ) {
    try {
      const { name, emails, id, provider, photos } = profile

      const familyName = name?.familyName || ''
      const givenName = name?.givenName || ''
      const fullName = familyName + givenName

      const user = {
        id: id,
        provider: provider,
        profileUrl: photos && photos.length > 0 ? photos[0].value : null,
        name: fullName,
        email: emails[0].value,
        accessToken,
        refreshToken
      }

      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }
}
