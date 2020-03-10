import { logger } from '../common/logger';
import * as config from 'config';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

export function connectMongo() {
    // Connect to MongoDB
    const mongoUrl: string = config.get('mongo.url');
    (mongoose as any).Promise = bluebird;
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
    ).catch(err => {
        logger.error('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    });
}
