import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException
} from '@nestjs/common'
import { DataService } from './data.service'
import { CreateDatumDto } from './dto/create-datum.dto'
import { UpdateDatumDto } from './dto/update-datum.dto'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Datum } from './entities/datum.entity'

@ApiTags('Date_Graph')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @ApiOperation({
    summary: '데이터 추가',
    description: '데이터베이스에 데이터 그래프 값을 추가합니다.'
  })
  @ApiBody({ type: CreateDatumDto })
  @Post()
  public async dateGraphCreate(
    @Body(ValidationPipe) createDatumDto: CreateDatumDto
  ): Promise<{ success: boolean }> {
    await this.dataService.dateGraphCreate(createDatumDto)

    return {
      success: true,
    }
  }

  @ApiOperation({
    summary: '데이터 그래프 모두 조회.'
  })
  @Get()
  public async dateGraphFindAll(): Promise<{ success: boolean; body: Datum[] }> {
    const dateGraphs = await this.dataService.dateGraphFindAll()

    return {
      success: true,
      body: dateGraphs
    }
  }

  @ApiOperation({
    summary: '데이터 그래프 하나만 조회.'
  })
  @Get(':id')
  public async findOne(@Param('id') id: number) {
    const graph = await this.dataService.findOne(id)

    if (!graph) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 date를 찾지 못했습니다`
      })
    }
    return {
      success: true,
      body: graph
    }
  }

  @ApiOperation({
    summary: '데이터 그래프 수정.'
  })
  @Patch(':id')
  public async dateGraphUpdate(
    @Param('id') id: number,
    @Body(ValidationPipe) updateDatumDto: UpdateDatumDto
  ): Promise<{ success: boolean; body: string }> {
    const graph = await this.dataService.findOne(id)

    if (!graph) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 date를 찾지 못했습니다`
      })
    }
    await this.dataService.dateGraphUpdate(id, updateDatumDto)

    return {
      success: true,
      body: `ID : ${graph.id} 업데이트 되었습니다.`
    }
  }

  @ApiOperation({
    summary: '데이터 그래프 삭제.'
  })
  @Delete(':id')
  public async dateGraphRemove(@Param('id') id: number): Promise<{ success: boolean, body: string }> {
    const graph = await this.dataService.findOne(id)

    if (!graph) {
      throw new NotFoundException({
        success: false,
        message: `ID : ${id} date를 찾지 못했습니다`
      })
    }
    await this.dataService.remove(id)

    return {
      success: true,
      body: `ID : ${graph.id} 삭제가 되었습니다.`
    }
  }
}
