import { Controller, Get, Post, Put, Delete, Req, Param, Body, Authorized } from 'routing-controllers';
import { Request } from 'express';
import { Inject } from 'typedi';
import { UserService, User } from '../services/UserService';
import { CustomError } from '../common/customError';

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
     *     description: Finds all users
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/UserModel'
     */
    @Get('s')
    async getUsers(): Promise<User[]> {
        return this.userService.findAll({ password: 0 });
    }

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     description: Find user by ID
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
     *         description: success
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Get('/:id')
    async getUser(@Req() req: Request,
        @Param('id') id: string): Promise<User> {

        req.assert('id', 'id cannot be blank').notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            throw new CustomError('parameter error', errors);
        }

        return this.userService.findById(id, { password: 0 });
    }

    /**
     * @swagger
     * /user:
     *   post:
     *     description: Create user
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: Created user object
     *         required: true
     *         schema:
     *           $ref: '#/definitions/UserModel'
     *     responses:
     *       200:
     *         description: success
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Authorized()
    @Post('/')
    async createUser(@Req() req: Request,
        @Body() user: User): Promise<User> {

        req.assert('userId', 'userId cannot be blank').notEmpty();
        req.assert('name', 'name cannot be blank').notEmpty();
        req.assert('password', 'password format error').notEmpty().isLength({ min: 6 });
        req.assert('email', 'email format error').isEmail();

        const errors = req.validationErrors();
        if (errors) {
            throw new CustomError('parameter error', errors);
        }

        return this.userService.save(user);
    }

    /**
     * @swagger
     * /user:
     *   put:
     *     description: Update an existing user
     *     tags:
     *       - User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: user object
     *         required: true
     *         schema:
     *           $ref: '#/definitions/UserModel'
     *     responses:
     *       200:
     *         description: success
     *         schema:
     *           $ref: '#/definitions/UserModel'
     */
    @Authorized()
    @Put('/')
    async updateUser(@Req() req: Request,
        @Body() user: User): Promise<User> {

        req.assert('userId', 'userId cannot be blank').notEmpty();
        req.assert('name', 'name cannot be blank').notEmpty();
        req.assert('password', 'password format error').notEmpty().isLength({ min: 6 });
        req.assert('email', 'email format error').isEmail();

        const errors = req.validationErrors();
        if (errors) {
            throw new CustomError('parameter error', errors);
        }

        return this.userService.findOneAndUpdate(user);
    }

    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     description: Delete a user
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
     *         description: success
     */
    @Authorized()
    @Delete('/:id')
    async deleteUser(@Req() req: Request,
        @Param('id') id: string): Promise<object> {

        req.assert('id', 'id cannot be blank').notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            throw new CustomError('parameter error', errors);
        }

        return this.userService.deleteOne(id);
    }
}
