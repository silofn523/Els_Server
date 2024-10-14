import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateDatumDto {
  @ApiProperty({
    description: '그래프',
    default: '5'
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly graph: number

  @ApiProperty({
    description: '유저 고유id',
    default: '3'
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly userId: number
}
