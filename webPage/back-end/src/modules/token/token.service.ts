import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_REPOSITORY } from '../../core/constants';
import { TokenDto } from './dto/token.dto';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
    constructor(@Inject(TOKEN_REPOSITORY) private readonly tokenRepository: typeof Token) { }

    /**
     * Create a token row in the Token table
     * @param {TokenDto} token - An object containing all informations about the token
     * @param {number} user_id - A number representing the relative user's id
     * @returns {Promise<Token>} the new Token
     */
    async create(token: TokenDto, user_id: number): Promise<Token> {
        return await this.tokenRepository.create<Token>({ ...token, user_id })
    }

    /**
     * Finds all token in database
     * @returns {Promise<Token[]} - A promise resolving in an array of all users
     */
    async findAll(): Promise<Token[]> {
        return await this.tokenRepository.findAll<Token>();
    }

    /**
     * Finds a token by its id
     * @param {number} id - the id of the Token to look for
     * @returns {Promise<Token>} - A promise resolving in the found token
     */
    async findOne(id: number): Promise<Token> {
        return await this.tokenRepository.findOne({ where: { id } });
    }

    /**
     * Finds a token by its access_token
     * @param {string} access_token - the access_token of the Token to look for
     * @returns {Promise<Token>} - A promise resolving in the found Token
     */
    async findOneByAccessToken(access_token: string): Promise<Token> {
        return await this.tokenRepository.findOne({ where: { access_token } });
    }

    /**
     * Finds a token by its user_id
     * @param {string} userId - the user id of the Token to look for
     * @returns {Promise<Token>} - A promise resolving in the found Token
     */
    async findOneByUserId(userId: number): Promise<Token> {
        return await this.tokenRepository.findOne({ where: { user_id: userId } });
    }

    /**
     * Deletes a token by its id
     * @param {number} id - the id of the Token to delete
     * @returns {Promise<number>} - a Promise resolving in the number of deleted rows
     */
    async delete(id: number): Promise<number> {
        return await this.tokenRepository.destroy({ where: { id } });
    }

    async deleteByUserId(user_id: number) {
        return await this.tokenRepository.destroy({ where: { user_id } })
    }

    /**
     * Updates the access_token and the expiration date of the given Token entity
     * @param {Token} tokenEntity - the Token to update
     * @param {string} newToken - the new access_token
     */
    async updateToken(tokenEntity: Token, newToken: any) {
        console.log(newToken.access_token)
        tokenEntity.access_token = newToken.access_token;
        tokenEntity.expiration_date = this.getNewExpirationDate(newToken.expires_in);
        tokenEntity.refresh_token = newToken.refresh_token;
        await tokenEntity.save();
        console.log(tokenEntity['dataValues'])
    }

    /**
     * Computes a new expiration date at J+7
     * @returns {Date} - the newly generated expiration date
     */
    private getNewExpirationDate(expDate?: number): Date {
        console.log("exp date", expDate)
        const newExpirationDate = new Date();
        // const testDate = new Date(newExpirationDate.getTime())

        newExpirationDate.setDate(newExpirationDate.getDate() + (expDate || 7));
        // testDate.setDate(testDate.getDate() + 7);
        // console.log(newExpirationDate.getTime() === testDate.getTime())
        return newExpirationDate
    }
}