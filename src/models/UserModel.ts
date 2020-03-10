/**
 * @swagger
 * definition:
 *   UserModel:
 *     type: object
 *     required:
 *       - userId
 *       - name
 *       - password
 *     properties:
 *       userId:
 *         type: string
 *       name:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 */
export class User {
    userId: string;
    name: string;
    password: string;
    email: string;
}