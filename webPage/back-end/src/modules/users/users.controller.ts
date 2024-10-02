import { Body, Controller, Delete, Get, Ip, Param, Post, Request, UseGuards } from "@nestjs/common";
import { DoesUserExist } from "../../core/guards/doesUserExist.guards";
import { Alarm } from "../alarms/alarm.entity";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(DoesUserExist)
    @Delete('deleteByMail')
    async deleteByMail(@Request() req) {
        console.debug(req.query || req.body.email)
        return await this.usersService.delete(req.query.email || req.body.email)
    }

    @Get()
    async getAll(@Ip() ip) {
        if (ip !== '::1') {
            return []
        }
        return await this.usersService.findAll();
    }

    @Post(':id/components')
    async registerComponent(@Param('id') userId: number, @Body() body: {uuid: string}): Promise<User> {
        return await this.usersService.registerComponent(userId, body.uuid)
    }

    @Get(':id/components')
    async getAllComponents(@Param('id') userId: number): Promise<Component[]> {
        return await this.usersService.findAllComponents(userId);
    }

    @Post(':id/alarms')
    async registerAlarm(@Param('id') userId: number, @Body() body: {uuid: string}): Promise<User> {
        return await this.usersService.registerAlarm(userId, body.uuid)
    }

    @Get(':id/alarms')
    async getAllAlarms(@Param('id') userId: number): Promise<Alarm[]> {
        return await this.usersService.findAllAlarms(userId);
    }
}