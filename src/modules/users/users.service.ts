import { AuthRegisterInput } from "@/auth/dto/auth.dto";
import { paginate } from "@/helpers/pagination.util";
import { setHashPassword } from "@/helpers/utils";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { UpdateUserInput } from "./dto/update-user.input";
import { RoleEnum, UserPaginationResponse } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { IUser } from "./entities/users";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async isEmailExist(email: string) {
    const isExist = await this.userRepository.findOneBy({ email });

    if (isExist) {
      return true;
    }

    return false;
  }

  async register(authRegisterInput: AuthRegisterInput): Promise<User> {
    const { email } = authRegisterInput;

    // check exist email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email da ton tai: ${email}. Hay su dung email khac`
      );
    }

    const hashedPassword = await setHashPassword(authRegisterInput.password);
    const newUser = this.userRepository.create({
      ...authRegisterInput,
      id: uuid(),
      password: hashedPassword,
      isActive: false,
      role: RoleEnum.Member,
    });
    return await this.userRepository.save(newUser);
  }

  updateUserToken = async (refreshToken: string, id: string) => {
    return await this.userRepository.update({ id }, { refreshToken });
  };

  async findAll(query: string): Promise<UserPaginationResponse> {
    return paginate<User>(this.userRepository, query);
  }

  async findOne(item: { [key: string]: string }) {
    const { key } = item;
    if (key === "id" && !isUUID(key)) {
      throw new BadRequestException(`User Not Found.`);
    }

    return await this.userRepository.findOneBy({
      [key]: key,
    });
  }

  async findByEmail(email: string) {
    const findItem = await this.userRepository.findOneBy({ email });
    if (!findItem) {
      throw new NotFoundException("Khong ton tai user nay");
    }

    return findItem;
  }

  async updateUser(id: string, updateUserInput: UpdateUserInput) {
    const checkExistUser = await this.userRepository.findOneBy({ id });
    if (!checkExistUser) {
      throw new NotFoundException("Khong ton tai user nay");
    }

    if (updateUserInput.password) {
      const getHashPassword = await setHashPassword(updateUserInput.password);
      updateUserInput.password = getHashPassword;
    }
    const dataNeedToUpdate = { ...checkExistUser, ...updateUserInput };
    await this.userRepository.update({ id }, dataNeedToUpdate);

    return dataNeedToUpdate;
  }

  async remove(id: string, currentUser: IUser) {
    if (!isUUID(id)) {
      throw new BadRequestException("Id ko dung dinh dang");
    }

    const checkUserIsAdmin = await this.userRepository.findOneBy({
      id: currentUser.id,
      role: RoleEnum.Admin,
      isActive: true,
    });
    if (!checkUserIsAdmin) {
      throw new BadRequestException("Ban khong co quyen xoa");
    }

    const findItem = await this.findOne({ id });
    const {_id, ...rest} = findItem

    const updateUserInput = {
      ...rest,
      isDeleted: true,
      deletedBy: {
        id: checkUserIsAdmin.id,
        email: checkUserIsAdmin.email,
      },
    };

    await this.userRepository.update({ id }, updateUserInput);
    return updateUserInput;
  }

  async searchTerms(regex: string) {
    return await this.findAll(regex);
  }
}
