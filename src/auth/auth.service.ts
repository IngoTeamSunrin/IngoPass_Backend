import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { User } from './auth.entity'
import { getConnection, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async create(user: User): Promise<void> {
        await this.userRepository.save(user)
    }

    async update(providerId: number, user: User): Promise<void> {
        const existUser = await this.userRepository.find()
        if (existUser) {
            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({
                    providerId: user.providerId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    grade: user.grade,
                    class: user.class,
                    num: user.num,
                    caution: user.caution,
                    jwt: user.jwt
                })
                .where("id = :id", { providerId })
                .execute()
        }
    }

    getToken(payload: JwtPayload) {
        const env = process.env
        const accessToken: any = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: env.JWT_SECRET,
        })

        const refreshToken: any = this.jwtService.sign(payload, {
            expiresIn: '15s',
            secret: env.JWT_SECRET,
        })

        return { accessToken, refreshToken }
    }
    insertUser(user: any, done: any) {
        return done(done, user)
    }
    async login(req) {
        if (!req.user) {
            return 'No user!'
        }

        return req.user
    }
}
