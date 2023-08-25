import jwt    from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { createHash } from 'node:crypto';

// user
import { IPeriodista } from '../types/periodista.type';
import { periodistaModel } from '../models/periodista.model';

// env
dotenv.config();

const SALT = "1234";

export class PeriodistaController {
    public static register(user:IPeriodista): Promise<any> {

        return new Promise((resolve, reject) => {
            periodistaModel.findOne({ mail: user.mail })
            .then(res => {
                console.log(res);
                if (res) {
                    reject("User already exists");
                    return;
                }
                user.password = this.sha256(user.password);
                periodistaModel.create(user)
                .then(res => resolve(res))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    public static login(user:IPeriodista): Promise<any> {
        return new Promise((resolve, reject) => {
            periodistaModel.findOne({ mail: user.mail })
            .then(Iuser => {
                if (!Iuser) reject("User not found");
                if (Iuser?.password != this.sha256(user.password)) reject("Wrong password");
                resolve(this.getToken(user));
            })
            .catch(err => reject(err));
        });
    }

    private static getToken(user:IPeriodista): string {
        return jwt.sign(
            user,
            process.env.JWT_PERIODISTA_SECRET || '',
            { 
                expiresIn: '5h' 
            }
        );
    }

    private static sha256(content: string) {  
        return createHash('sha256').update(content).digest('hex')
    }
    
}