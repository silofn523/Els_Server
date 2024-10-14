import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  public async googleLogin(req: Request) {
    const user = req.user as User
    const googleUser = await this.userService.getOneEmailByUser(
      user.email + ' ' + user.id,
      'google'
    )

    if (!user) {
      return {
        success: false,
        message: 'No user from google'
      }
    }

    if (googleUser) {
      await this.userService.updateUser(user.email + ' ' + user.id, {
        email: user.email + ' ' + user.id,
        name: user.name,
        profileUrl: user.profileUrl,
        updateAt: user.updateAt
      })
    } else {
      await this.userService.insertUser(user)
    }

    return {
      message: 'User information from google',
      user: user
    }
  }

  public async verifyGoogleToken(token: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
      )
      const tokenInfo = await response.json()

      if (tokenInfo.error) {
        throw new InternalServerErrorException('Google Token Validation Failed: ' + tokenInfo.error)
      }

      return tokenInfo
    } catch (error) {
      throw new InternalServerErrorException('Google Token Validation Failed')
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<any> {
    const params: { [key: string]: string } = {
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }

    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_PW')

    if (clientSecret) {
      params.client_secret = clientSecret
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    })

    const data = await response.json()

    if (data.error) {
      throw new NotAcceptableException({
        success: false,
        message: `구글 토큰 재발급에 실패했습니다: ${data.error}`
      })
    }

    return data
  }
}
