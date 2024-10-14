import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class KakaoService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  public async kakaoLogin(req: Request) {
    const user = req.user as User
    const kakaoUser = await this.userService.getOneEmailByUser(user.email + ' ' + user.id, 'kakao')

    if (!user) {
      return {
        success: false,
        message: 'No user from Kakao'
      }
    }

    if (kakaoUser) {
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
      message: 'User information from Kakao',
      user: user
    }
  }

  public async verifyKakaoToken(token: string) {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const tokenInfo = await response.json()

      if (tokenInfo.code) {
        // 카카오는 에러 발생 시 `code`라는 필드로 에러를 전달함
        throw new InternalServerErrorException('Kakao Token Validation Failed: ' + tokenInfo.msg)
      }

      return tokenInfo
    } catch (error) {
      throw new InternalServerErrorException('Kakao Token Validation Failed')
    }
  }

  public async refreshKakaoAccessToken(refreshToken: string): Promise<any> {
    const params: { [key: string]: string } = {
      grant_type: 'refresh_token',
      client_id: this.configService.get<string>('KAKAO_RESTAPI_KEY'),
      refresh_token: refreshToken
    }

    const clientSecret = this.configService.get<string>('KAKAO_CLIENT_PW')

    if (clientSecret) {
      params.client_secret = clientSecret
    }

    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    })

    const data = await response.json()

    if (data.error) {
      throw new NotAcceptableException({
        success: false,
        message: `카카오 토큰 재발급에 실패했습니다: ${data.error_description}`
      })
    }

    return data
  }
}
