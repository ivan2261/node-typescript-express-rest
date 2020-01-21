import { Req, Res, Controller, Get, Param } from 'routing-controllers';
import { Request, Response } from 'express';
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
    async getUsers(@Req() req: Request, @Res() res: Response) {
        const data: User[] = await this.userService.findAll();
        res.status(200).send(data);
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
    async getById(@Req() req: Request, @Res() res: Response,
        @Param('id') id: string) {
        req.assert('id', 'id cannot be blank').notEmpty();
        const errors = req.validationErrors();

        const data: User = await this.userService.findById(id);
        res.status(200).send(data);
    }
}
