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

  async findOne(item: {[key: string]: string}) {
    const {key} = item
    if (key === 'id' && !isUUID(key)) {
      return `not found user`;
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
    await this.userRepository.update({ id }, { ...updateUserInput });

    return "Update user OK";
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException("Id ko dung dinh dang");
    }

    const checkUserIsAdmin = await this.userRepository.findOneBy({
      id,
      role: RoleEnum.Admin,
    });
    if (checkUserIsAdmin) {
      throw new BadRequestException("Ban khong co quyen xoa");
    }

    return this.updateUser(id, {
      isDeleted: true,
      deletedBy: {
        _id: checkUserIsAdmin._id,
        email: checkUserIsAdmin.email,
      },
    });
  }

  async searchTerms(regex: string) {
    return await this.findAll(regex);
  }
}
