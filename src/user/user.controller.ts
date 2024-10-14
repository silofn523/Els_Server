import { Controller, Get, Param, Delete, NotFoundException } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '모든 사용자 조회'
  })
  @Get()
  public async findAllUser(): Promise<{ success: boolean; body: User[] }> {
    const users = await this.userService.findAllUser()

    return {
      success: true,
      body: users
    }
  }

  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: '사용자 정보를 불러옵니다.'
  })
  @Get(':id')
  public async getOneUser(
    @Param('id') id: number
  ): Promise<{ success: boolean; body: User | void }> {
    const user = await this.userService.getOneUserANDEmailClean(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: user
    }
  }

  @ApiOperation({
    summary: '사용자 계정삭제',
    description: '사용자 계정을 삭제 합니다.'
  })
  @Delete(':id')
  public async deleteUser(@Param('id') id: number): Promise<{ success: boolean; body: string }> {
    const user = await this.userService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    await this.userService.deleteUser(id)
    return {
      success: true,
      body: `ID : ${user.id} 삭제가 되었습니다.`
    }
  }
}
