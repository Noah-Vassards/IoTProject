import { Controller, Delete, Get, Ip, Request } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Get()
    async getAll(@Ip() ip) {
        if (ip !== '::1') {
            return []
        }
        return await this.tokenService.findAll()
    }

    // @Delete('deleteById')
    // async deleteById(@Ip() ip, @Request() req) {
    //     if (ip !== '::1') {
    //         return []
    //     }
    //     return await this.tokenService.deleteById(req.body.id || req.query.id)
    // }
    @Delete('deleteByUserId')
    async deleteByUserId(@Ip() ip, @Request() req) {
        if (ip !== '::1') {
            return []
        }
        return await this.tokenService.deleteByUserId(req.body.user_id || req.query.user_id)
    }
}