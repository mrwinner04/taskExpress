import User, { UserAttributes } from "./user.model";

export class UserService {
  static async getAllUsersPerCompany(companyId: string): Promise<User[]> {
    return await User.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  static async createUser(userData: {
    companyId: string;
    email: string;
    name: string;
  }): Promise<User> {
    return await User.create({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async updateUser(
    id: string,
    updateData: Partial<UserAttributes>
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }

    await user.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return user;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }

    await user.update({
      deletedAt: new Date(),
    });

    return true;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  static async getUsersByCompany(companyId: string): Promise<User[]> {
    return await User.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getUserCount(companyId: string): Promise<number> {
    return await User.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  static async isEmailExists(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    const whereClause: any = {
      email,
      deletedAt: null,
    };

    if (excludeId) {
      whereClause.id = {
        [require("sequelize").Op.ne]: excludeId,
      };
    }

    const count = await User.count({ where: whereClause });
    return count > 0;
  }

  static validateUserData(userData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!userData.companyId) {
      errors.push("Company ID is required");
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push("Email is required");
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push("Invalid email format");
    }

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push("User name is required");
    }

    if (userData.name && userData.name.length > 100) {
      errors.push("User name must be less than 100 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
