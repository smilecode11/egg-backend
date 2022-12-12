import 'egg';
import { Connection, Model } from 'mongoose'
import { UserProps } from '../app/model/user'

declare module 'egg' {

    interface MongooseModels extends IModel {
        // User: Model<UserProps>
        [key: string]: Model<any>
    }

    interface Application {
        mongoose: Connection
    }

    interface Context {
        //  egg-bcrypt 扩展
        genHash(plaintext: string): Promise<string>,
        compare(plainText: string, hash: string): Promise<boolean>
    }

    interface EggAppConfig {
        bcrypt: {
            saltRounds: number;
        }
    }
}