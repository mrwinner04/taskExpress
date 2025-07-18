import { User, UserAttributes } from "../config/associations";

class UserService {
  async getAllUsersPerCompany(companyId: string): Promise<User[]> {
    return await User.findAll({
      where: {
        companyId: companyId,
      },
      order: [["name", "ASC"]],
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  async createUser(userData: {
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

  async updateUser(
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

  async deleteUser(id: string): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }

  async isEmailExists(email: string, excludeId?: string): Promise<boolean> {
    if (!email || email.trim().length === 0) {
      return false;
    }

    const whereClause: any = {
      email: email.trim(),
    };

    if (excludeId) {
      whereClause.id = {
        [require("sequelize").Op.ne]: excludeId,
      };
    }

    const count = await User.count({ where: whereClause });
    return count > 0;
  }

  validateUserData(userData: any): {
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

export default new UserService();
