import { Body, Controller, Delete, Get, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../core/guards/auth.guard";
import { DoesUserExist } from "../../core/guards/doesUserExist.guards";
import { Alarm } from "../alarms/alarm.entity";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { RolesGuard } from "src/core/guards/hasRole.guards";
import { Roles } from "src/core/decorators/roles.decorator";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(DoesUserExist)
    @Delete('deleteByMail')
    async deleteByMail(@Request() req) {
        if (req.user.role !== 'admin') {
            throw new UnauthorizedException()
        }
        console.debug(req.query || req.body.email)
        return await this.usersService.delete(req.query.email || req.body.email)
    }
    
    @Get()
    async getAll(@Request() req) {
        if (req.user.role !== 'admin') {
            throw new UnauthorizedException()
        }
        return await this.usersService.findAll();
    }

    @Post('components')
    async registerComponent(@Request() req, @Body() body: {uuid: string}): Promise<User> {
        return await this.usersService.registerComponent(req.user.id, body.uuid)
    }

    @Get('components')
    async getAllComponents(@Request() req): Promise<Component[]> {
        return await this.usersService.findAllComponents(req.user.id);
    }

    @Post('alarms')
    async registerAlarm(@Request() req, @Body() body: {uuid: string}): Promise<User> {
        return await this.usersService.registerAlarm(req.user.id, body.uuid)
    }

    @Get('alarms')
    async getAllAlarms(@Request() req): Promise<Alarm[]> {
        return await this.usersService.findAllAlarms(req.user.id);
    }
}