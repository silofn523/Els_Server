import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateDatumDto } from './create-datum.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateDatumDto extends PartialType(CreateDatumDto) {
  @ApiProperty({
    description: '그래프',
    default: '5'
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly graph: number
}
