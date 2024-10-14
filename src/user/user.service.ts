import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  public async findAllUser(): Promise<User[]> {
    return await this.user.find()
  }

  public async insertUser(user: User) {
    await this.user.insert({
      email: user.email + ' ' + user.id,
      name: user.name,
      provider: user.provider,
      profileUrl: user.profileUrl,
      createdAt: user.createdAt
    })
  }

  public async save(userId: User) {
    await this.user.save(userId)
  }

  public async updateUser(email: string, updateData: UpdateUserDto): Promise<void> {
    await this.user.update({ email }, updateData)
  }

  public async getOneUserANDEmailClean(id: number): Promise<User> {
    const user = await this.user.findOne({
      where: {
        id
      }
    })
    if (user) {
      user.email = this.cleanEmail(user.email)
    }

    return user
  }

  public async getOneUser(id: number): Promise<User> {
    return await this.user.findOne({
      where: {
        id
      }
    })
  }

  private cleanEmail(email: string): string {
    return email.replace(/(com\s*\d+)/, 'com')
  }

  public async getOneEmailByUser(email: string, provider: string): Promise<User> {
    return await this.user.findOne({
      where: {
        email,
        provider
      }
    })
  }

  public async deleteUser(id: number): Promise<void> {
    await this.user.delete({ id })
  }
}
