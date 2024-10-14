import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDate, IsEmail } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: '소셜 계정 타입',
    default: 'google | kakao'
  })
  @IsString()
  public readonly provider: string

  @ApiProperty({
    description: '사용자 이름(닉네임)',
    default: '김승환 | silofn523'
  })
  @IsString()
  public readonly name: string

  @ApiProperty({
    description: '이메일',
    default: 'silofn523@gmail.com'
  })
  @IsEmail()
  @IsString()
  public readonly email: string

  @ApiProperty({
    description: '계정 생성시간',
    default: '2024-09-02/09:02'
  })
  @IsDate()
  public readonly createdAt: Date
}
