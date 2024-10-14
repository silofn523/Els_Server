import { Injectable, NotAcceptableException } from '@nestjs/common'
import { CreateDatumDto } from './dto/create-datum.dto'
import { UpdateDatumDto } from './dto/update-datum.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Datum } from './entities/datum.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Datum)
    private readonly data: Repository<Datum>,
    private readonly userService: UserService
  ) {}

  public async dateGraphCreate(createDatumDto: CreateDatumDto): Promise<void> {
    const userId = await this.userService.getOneUser(createDatumDto.userId)

    if (!userId) {
      throw new NotAcceptableException({
        success: false,
        message: `ID : ${createDatumDto.userId}를 가진 해당 유저는 없습니다.`
      })
    }
    await this.data.insert({
      graph: createDatumDto.graph,
      userId: createDatumDto.userId,
    })
  }

  public async dateGraphFindAll(): Promise<Datum[]> {
    return await this.data.find()
  }

  public async findOne(id: number): Promise<Datum> {
    return await this.data.findOne({
      where: {
        id
      }
    })
  }

  public async findOneUserId(id: number): Promise<Datum> {
    return await this.data.findOne({
      where: {
        userId: id
      }
    })
  }

  public async dateGraphUpdate(id: number, updateDatumDto: UpdateDatumDto): Promise<void> {
    await this.data.update({ id }, updateDatumDto)
  }

  public async remove(id: number): Promise<void> {
    await this.data.delete({ id })
  }
}
