import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, database }: dbConfig = config.get('dbConfig');

const dbConnection = {
  url: `mongodb://${host}:${port}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};

export default dbConnection;
