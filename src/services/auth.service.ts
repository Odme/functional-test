import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import UserModel from '@models/users.model';
import { isEmpty } from '@utils/util';

const AuthService = () => {
  const createToken = (user: User): TokenData => {
    // eslint-disable-next-line no-underscore-dangle
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secret: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  };

  const createCookie = (tokenData: TokenData): string => `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;

  const login = async (userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> => {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  };

  const logout = async (userData: User): Promise<User> => {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserModel.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    return findUser;
  };

  const signup = async (userData: CreateUserDto): Promise<User> => {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  };

  return { login, logout, signup };
};

export default AuthService;
