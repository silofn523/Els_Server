import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { KakaoAuthGuard } from './kakao.guard'

@ApiTags('Kakao_Auth')
@Controller('auth/kakao')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @ApiOperation({
    summary: '카카오 로그인 요청',
    description: '카카오 로그인을 요청 합니다.'
  })
  @Get('')
  @UseGuards(KakaoAuthGuard)
  public async kakaoLogin(@Res() res: Response) {}

  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인 콜백을 처리하여 토큰을 리턴합니다.'
  })
  @Get('/callback')
  @UseGuards(KakaoAuthGuard)
  public async kakaoLoginCallback(@Req() req: Request) {
    return await this.kakaoService.kakaoLogin(req)
  }

  @ApiOperation({
    summary: '카카오 토큰 검증',
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
    const userInfo = await this.kakaoService.verifyKakaoToken(token)

    return {
      success: true,
      body: {
        userInfo
      }
    }
  }

  @ApiOperation({
    summary: '카카오 토큰 재발급',
    description: '카카오 토큰을 갱신합니다.'
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
    const newTokenData = await this.kakaoService.refreshKakaoAccessToken(refreshToken)

    return {
      success: true,
      body: { newAccessToken: newTokenData.access_token }
    }
  }
}
