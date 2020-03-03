import { Controller, Get, Req, Param, Authorized } from 'routing-controllers';
import { Request } from 'express';
import { Inject } from 'typedi';
import { UserService, User } from '../services/UserService';

/**
 * @swagger
 * tags:
 *   name: User
 */
@Controller('/user')
export class UserController {

    @Inject()
    userService: UserService;

    /**
     * @swagger
     * /users:
     *   get:
     *     description: Get some users
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: user model
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Authorized()
    @Get('s')
    async getUsers(@Req() req: Request): Promise<User[]> {
        return this.userService.findAll();
    }

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     description: Get a user by id
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         description: id of user
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: user model
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Get('/:id')
    async getById(@Req() req: Request,
        @Param('id') id: string): Promise<User> {

        req.assert('id', 'id cannot be blank').notEmpty();
        const errors = req.validationErrors();

        return this.userService.findById(id);
    }
}
