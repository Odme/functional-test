process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = App([IndexRoute(), new UsersRoute(), new AuthRoute()]);

app.initializeErrorHandling();
app.initializeMiddlewares();
app.initializeRoutes();
app.initializeSwagger();
app.listen();
