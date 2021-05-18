import './process.config.ts';
import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = App([IndexRoute(), UsersRoute(), AuthRoute()]);

app.connectToDatabase();
app.listen();
