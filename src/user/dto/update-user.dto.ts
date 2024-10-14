import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsDate, IsEmail, IsString } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '이메일',
    default: 'silofn523@gmail.com'
  })
  @IsEmail()
  @IsString()
  public readonly email: string

  @ApiProperty({
    description: '사용자 이름(닉네임)',
    default: '김승환 | silofn523'
  })
  @IsString()
  public readonly name: string

  @ApiProperty({
    description: '프로필 사진 경로',
    default: 'xxxxxxxx.png'
  })
  @IsString()
  public readonly profileUrl: string

  @ApiProperty({
    description: '계정 최근 로그인 시간',
    default: '2024-09-02/09:02'
  })
  @IsDate()
  public readonly updateAt: Date | null
}
