/**
 * @swagger
 * definition:
 *   UserModel:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - password
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 */
export class User {
    id: string;

    password: string;

    email: string;

    constructor(public name: string = 'Austin') {
    }
}