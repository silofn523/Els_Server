import { Controller, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleService } from './google.service'
import { GoogleAuthGuard } from 'src/google/google.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Google_Auth')
@Controller('auth/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @ApiOperation({
    summary: '구글 로그인 요청',
    description: '구글 로그인을 요청 합니다.'
  })
  @Get()
  @UseGuards(GoogleAuthGuard)
  public async googleLogin(@Res() res: Response) {}

  @ApiOperation({
    summary: '구글 로그인 콜백',
    description: '구글 로그인 콜백을 처리하여 토큰을 리턴합니다.'
  })
  @Get('/callback')
  @UseGuards(GoogleAuthGuard)
  public async googleLoginCallback(@Req() req: Request) {
    return await this.googleService.googleLogin(req)
  }

  @ApiOperation({
    summary: '구글 토큰 검증',
    description: '발급받은 토큰을 검증합니다.'
  })
  @Get('check_token')
  public async checkToken(@Req() req: Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token missing'
      })
    }

    if (!token.startsWith('ya')) {
      throw new UnauthorizedException({
        success: false,
        message: '잘못된 토큰입니다.'
      })
    }
    const userInfo = await this.googleService.verifyGoogleToken(token)

    return {
      success: true,
      body: {
        userInfo
      }
    }
  }

  @ApiOperation({
    summary: '구글 토큰 재발급',
    description: '구글 토큰을 갱신합니다.'
  })
  @Get('refresh')
  public async refreshGoogleToken(@Req() req: Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }

    const refreshToken = authHeader.split(' ')[1]

    if (!refreshToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'Refresh Token missing'
      })
    }

    if (refreshToken.startsWith('ya')) {
      // Google 엑세스 토큰의 일반적인 접두사
      throw new UnauthorizedException({
        success: false,
        message: '토큰 재발급은 Refresh토큰으로만 가능합니다.'
      })
    }
    const newTokenData = await this.googleService.refreshAccessToken(refreshToken)

    return {
      success: true,
      body: { newAccessToken: newTokenData.access_token }
    }
  }
}
