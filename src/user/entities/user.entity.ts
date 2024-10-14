import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Datum } from 'src/data/entities/datum.entity'

@Entity('user')
export class User extends BaseEntity {
  @ApiProperty({
    description: '기본키',
    default: '1'
  })
  @PrimaryGeneratedColumn({
    name: 'user_id'
  })
  public readonly id: number

  @ApiProperty({
    description: '소셜 계정 타입',
    default: 'google | kakao'
  })
  @Column({
    name: 'provider',
    type: 'varchar'
  })
  @IsString()
  public readonly provider: string // 구글 혹은 애플 혹은 카카오 어떤 계정인지 상태 체크

  @ApiProperty({
    description: '사용자 이름(닉네임)',
    default: '김승환 | silofn523'
  })
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false
  })
  @IsString()
  public readonly name: string

  @ApiProperty({
    description: '이메일',
    default: 'silofn523@gmail.com'
  })
  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string

  @ApiProperty({
    description: '프로필 사진 경로',
    default: 'xxxxxxxx.png'
  })
  @Column({
    name: 'profile_url',
    type: 'varchar',
    nullable: true
  })
  @IsString()
  public readonly profileUrl: string

  @ApiProperty({
    description: '계정 생성시간',
    default: '2024-09-02/09:02'
  })
  @CreateDateColumn({
    name: 'createAt',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  public readonly createdAt: Date

  @ApiProperty({
    description: '계정 최근 로그인 시간',
    default: '2024-09-02/09:02'
  })
  @UpdateDateColumn({
    name: 'updateAt',
    type: 'timestamp',
    nullable: true,
    default: null
  })
  @IsDate()
  public readonly updateAt: Date | null

  @OneToMany(() => Datum, (data) => data.user, { cascade: true, onDelete: 'CASCADE', eager: true })
  public graph: Datum[]
}
