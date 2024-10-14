import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'
import { User } from 'src/user/entities/user.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Datum extends BaseEntity {
  @ApiProperty({
    description: '기본키',
    default: '1'
  })
  @PrimaryGeneratedColumn()
  public readonly id: number

  @ApiProperty({
    description: '그래프',
    default: '5'
  })
  @Column({
    name: 'graph',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly graph: number

  @ApiProperty({
    description: '유저 고유id',
    default: '3'
  })
  @Column({
    name: 'user_id',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly userId: number

  @ApiProperty({
    description: '생성시간',
    default: '2024-09-02/09:02'
  })
  @CreateDateColumn({
    name: 'createAt',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  public readonly createdAt: Date

  @ManyToOne(() => User, (user) => user.graph, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  public readonly user: User
}
