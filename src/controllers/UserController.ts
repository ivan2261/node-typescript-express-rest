import { Req, Controller, Get, Param } from 'routing-controllers';
import { Request } from 'express';
import { Inject } from 'typedi';
import { UserService, User } from '../services/UserService';

@Controller('/users')
export class UserController {

    @Inject()
    userService: UserService;

    /**
     * @swagger
     * /users:
     *   get:
     *     description: gets some users
     *     operationId: getUsers
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: user model
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Get('/')
    async getUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     description: Get a user by id
     *     operationId: getById
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
