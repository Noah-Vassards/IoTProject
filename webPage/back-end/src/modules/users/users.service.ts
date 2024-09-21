import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../core/constants';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
import { Component } from '../components/component.entity';
import { CreateComponentDto } from '../components/dto/createComponent.dto';
import { ComponentsService } from '../components/components.service';

/**
 * Service responsible for managing users.
 * @class
 */
@Injectable()
export class UsersService {

    /**
     * Creates an instance of UsersService.
     * @param {typeof User} userRepository - The user repository.
     */
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private readonly tokenService: TokenService,
        private readonly componentService: ComponentsService
    ) { }

    /**
     * Creates a new user.
     * @param {UserDto} user - The user data.
     * @returns {Promise<User>} - A promise resolving to the created user.
     */
    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    /**
     * Finds all users in database
     * @returns {Promise<User[]>} - A promise resoling in an array of users
     */
    async findAll(): Promise<User[]> {
        console.log('getting all users')
        return await this.userRepository.findAll<User>({ include: Component });
    }

    /**
     * Finds a user by email.
     * @param {string} email - The email of the user to find.
     * @returns {Promise<User>} - A promise resolving to the found user.
     */
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email }, include: Component });
    }

    /**
     * Finds a user by ID.
     * @param {number} id - The ID of the user to find.
     * @returns {Promise<User>} - A promise resolving to the found user.
     */
    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id }, include: Component });
    }

    async registerComponent(id: number, createComponentDto: CreateComponentDto): Promise<User> {
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Component });
        if (!user) {
            throw new BadRequestException('User is unknown')
        }
        const component = await this.componentService.create(createComponentDto, id);

        user.components.push(component)
        return user.save()
    }

    async findAllComponents(id: number): Promise<Component[]> {
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Component })

        return user.components
    }

    /**
     * Delete a user by email
     * @param {string} email - The email address of the user to delete
     */
    async delete(email: string): Promise<number> {
        const users = await this.userRepository.findAll({ where: { email } })
        users.forEach(async (user) => {
            await this.tokenService.deleteByUserId(user.id)
        })
        return await this.userRepository.destroy({ where: { email } })
    }

    async deleteAll() {
        return await this.userRepository.destroy()
    }
}