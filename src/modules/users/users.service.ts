import { AuthRegisterInput } from "@/auth/dto/auth.dto";
import { paginate } from "@/helpers/pagination.util";
import { setHashPassword } from "@/helpers/utils";
import { UpdateUserInput } from "@/modules/users/dto/update-user.input";
import { User } from "@/modules/users/entities/user.entity";
import { IUser } from "@/modules/users/entities/users.d";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Role } from "../roles/entities/role.entity";
import { RoleEnum, UserPaginationResponse, UserType } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async isEmailExist(email: string) {
    const isExist = await this.userRepository.findOneBy({ email });

    if (isExist) {
      return true;
    }

    return false;
  }

  async register(
    authRegisterInput: AuthRegisterInput,
    currentUser: IUser
  ): Promise<UserType> {
    const { email } = authRegisterInput;

    // check exist email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email already exists: ${email}. Please use another`
      );
    }

    /* const findItem = await this.roleRepository.findOneBy({
      name: RoleEnum.Member,
    }); */
    const hashedPassword = await setHashPassword(authRegisterInput.password);
    const newUser = this.userRepository.create({
      ...authRegisterInput,
      password: hashedPassword,
      isActive: false,
      // role: findItem,
      createdBy: {
        id: currentUser.id,
        email: currentUser.email,
      },
    });
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    const findItem = await this.userRepository.findOneBy({ email });
    if (!findItem) {
      throw new NotFoundException("Khong ton tai user nay");
    }

    return findItem;
  }

  updateUserToken = async (refreshToken: string, id: string) => {
    return await this.userRepository.update({ id }, { refreshToken });
  };

  async findOne(item: { [key: string]: string }) {
    const { key } = item;
    if (key === "id" && !isUUID(key)) {
      throw new BadRequestException(`User Not Found.`);
    }

    return await this.userRepository.findOne({
      where: { [key]: key },
      relations: ["roles", "role.permissions"],
    });
  }

  async findAll(query: string): Promise<UserPaginationResponse> {
    return paginate<UserType>(this.userRepository, query);
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

    let role = null
    if (updateUserInput.role) {
      role = await this.roleRepository.findOneBy({
        name: updateUserInput.role.name,
      });
    }

    const dataNeedToUpdate = {
      ...checkExistUser,
      ...updateUserInput,
      role,
      updatedBy: {
        id: checkExistUser.id,
        email: checkExistUser.email,
      },
    };
    await this.userRepository.update({ id }, dataNeedToUpdate);

    return dataNeedToUpdate;
  }

  async remove(id: string, currentUser: IUser) {
    if (!isUUID(id)) {
      throw new BadRequestException("Id ko dung dinh dang");
    }

    const findRole = await this.roleRepository.findOneBy({
      name: RoleEnum.Member,
    });
    const checkUserIsAdmin = await this.userRepository.findOneBy({
      id: currentUser.id,
      // role: findRole,
      isActive: true,
    });
    if (!checkUserIsAdmin) {
      throw new BadRequestException("Ban khong co quyen xoa");
    }

    const findItem = await this.findOne({ id });
    const { _id, ...rest } = findItem;

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

  findUserByToken = async (refreshToken: string) => {
    return await this.userRepository.findOne({
      where: { refreshToken },
      relations: ["role"],
      /*  select: {
        role: {
          name: true,
        },
      }, */
    });
  };
}
