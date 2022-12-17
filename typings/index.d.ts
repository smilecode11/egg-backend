import 'egg';
import { Connection, Model } from 'mongoose'
import { Options } from 'ali-oss'
import * as OSS from 'ali-oss'
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
        compare(plainText: string, hash: string): Promise<boolean>,
        //  oss 扩展
        oss: OSS
    }

    interface EggAppConfig {
        bcrypt: {
            saltRounds: number;
        },
        oss: {
            client?: Partial<Options>
        }
    }
}