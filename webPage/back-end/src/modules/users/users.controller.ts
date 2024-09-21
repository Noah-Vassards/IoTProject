import { Body, Controller, Delete, Get, Ip, Param, Post, Request, UseGuards } from "@nestjs/common";
import { DoesUserExist } from "../../core/guards/doesUserExist.guards";
import { UsersService } from "./users.service";
import { Component } from "../components/component.entity";
import { User } from "./users.entity";
import { CreateComponentDto } from "../components/dto/createComponent.dto";
import { IsAutenticated } from "src/core/guards/isAuthenticated.guards";

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
    async registerComponent(@Param('id') userId: number, @Body() createComponentDto: CreateComponentDto): Promise<User> {
        return await this.usersService.registerComponent(userId, createComponentDto)
    }

    @Get(':id/components')
    async getAllComponents(@Param('id') userId: number): Promise<Component[]> {
        return await this.usersService.findAllComponents(userId);
    }
}