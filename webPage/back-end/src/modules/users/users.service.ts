import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { USER_REPOSITORY } from '../../core/constants';
import { Alarm } from '../alarms/alarm.entity';
import { AlarmsService } from '../alarms/alarm.service';
import { CreateAlarmDto } from '../alarms/dto/createAlarm.dto';
import { Component } from '../components/component.entity';
import { ComponentsService } from '../components/components.service';
import { CreateComponentDto } from '../components/dto/createComponent.dto';
import { MqttService } from '../mqtt/mqtt.service';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
import { MailService } from '../mail/mail.service';
import { OnEvent } from '@nestjs/event-emitter';



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
        private readonly componentService: ComponentsService,
        private readonly alarmService: AlarmsService,
        private readonly mqttService: MqttService,
        private readonly mailService: MailService,
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
        return await this.userRepository.findAll<User>({ include: [Component, Alarm] });
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

    @OnEvent('notify.activation')
    async notifyUser(payload: { userId: number, alarmName: string }) {
        const user = await this.userRepository.findOne({ where: { id: payload.userId } })
        const mailBody = `Bonjour ${user.name},<br><br>

        Le régulateur '${payload.alarmName}' a été activé.<br>
        Si vous souhaiter qu'il reste éteint, vous pouvez le désactiver manuellemenent.<br><br>
        
        A bientôt !`
        await this.mailService.sendMail({ address: [user.email], subject: 'Régulateur activé', text: mailBody, from: "L'équipe Bacchus" })
    }

    async registerComponent(id: number, uuid: string): Promise<User> {
        // this.mqttService.subscribeToTopic(`/validate/${uuid}`)
        // this.mqttService.publish(`/check/${uuid}`, JSON.stringify({userId: id}))

        // const message = await new Promise<string>((resolve, reject) => {
        //     const timeout = setTimeout(() => {
        //         reject(new BadRequestException('Timeout: No response received from the MQTT broker.'));
        //     }, 5000);

        //     this.mqttService.setMessageCallback((topic: string, payload: string) => {
        //         if (topic === `/validate/${uuid}`) {
        //             clearTimeout(timeout);
        //             resolve(payload);
        //         }
        //     });
        // });

        // if (!JSON.parse(message).validate) {
        //     throw new BadRequestException()
        // }
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Component });
        if (!user) {
            throw new BadRequestException('User is unknown')
        }
        const component = await this.componentService.create({ uuid: uuid, name: "Nouveau Capteur", data: undefined }, id);

        if (!component) {
            throw new BadRequestException('Error while creating new component')
        }

        const mailBody = `Bonjour ${user.name},<br><br>

        Votre nouveau capteur a été ajouté avec succès.<br>
        Merci de faire confiance à nos service.<br><br>
        
        A bientôt !`
        await this.mailService.sendMail({ address: [user.email], subject: 'Nouveau capteur ajouté !', text: mailBody, from: "L'équipe Bacchus" })

        user.components.push(component)
        return user.save()
    }

    async findAllComponents(id: number): Promise<Component[]> {
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Component })

        if (!user) {
            throw new BadRequestException('User not found')
        }

        return user.components
    }

    async registerAlarm(id: number, uuid: string): Promise<User> {
        // this.mqttService.subscribeToTopic(`/validate/${uuid}`)
        // this.mqttService.publish(`/check/${uuid}`, JSON.stringify({ userId: id }))

        // const message = await new Promise<string>((resolve, reject) => {
        //     const timeout = setTimeout(() => {
        //         reject(new BadRequestException('Timeout: No response received from the MQTT broker.'));
        //     }, 5000);

        //     this.mqttService.setMessageCallback((topic: string, payload: string) => {
        //         if (topic === `/validate/${uuid}`) {
        //             clearTimeout(timeout);
        //             resolve(payload);
        //         }
        //     });
        // });

        // if (!JSON.parse(message).validate) {
        //     throw new BadRequestException()
        // }
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Alarm });
        if (!user) {
            throw new BadRequestException('User is unknown')
        }
        const alarm = await this.alarmService.create({ uuid, name: 'Nouveau Régulateur', activated: false }, id);

        const mailBody = `Bonjour ${user.name},<br><br>

        Votre nouveau régulateur a été ajouté avec succès.<br>
        Merci de faire confiance à nos service.<br><br>
        
        A bientôt !`
        await this.mailService.sendMail({ address: [user.email], subject: 'Nouveau régulateur ajouté !', text: mailBody, from: "L'équipe Bacchus" })

        user.alarms.push(alarm)
        return user.save()
    }

    async findAllAlarms(id: number): Promise<Alarm[]> {
        const user = await this.userRepository.findOne<User>({ where: { id }, include: Alarm })

        if (!user) {
            throw new BadRequestException('User not found')
        }

        return user.alarms
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