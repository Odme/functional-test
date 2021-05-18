import bcrypt from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import UserModel from '@models/users.model';
import { isEmpty } from '@utils/util';

const UserService = () => {
  const findAllUser = async (): Promise<User[]> => {
    const users: User[] = await UserModel.find();
    return users;
  };

  const findUserById = async (userId: string): Promise<User> => {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  };

  const createUser = async (userData: CreateUserDto): Promise<User> => {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  };

  const updateUser = async (userId: string, userData: CreateUserDto): Promise<User> => {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const copyUser = { ...userData };

    if (copyUser.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email });
      // eslint-disable-next-line no-underscore-dangle
      if (findUser && findUser._id !== userId) throw new HttpException(409, `You're email ${userData.email} already exists`);
    }

    if (copyUser.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      copyUser.password = hashedPassword;
    }

    const updateUserById: User = await UserModel.findByIdAndUpdate(userId, { copyUser });
    if (!updateUserById) throw new HttpException(409, "You're not user");

    return updateUserById;
  };

  const deleteUser = async (userId: string): Promise<User> => {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  };

  return {
    createUser,
    deleteUser,
    findAllUser,
    findUserById,
    updateUser,
  };
};

export default UserService;
