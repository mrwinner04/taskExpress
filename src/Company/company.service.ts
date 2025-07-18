import { Company, User } from "../config/associations";

class CompanyService {
  async getAllCompanies(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Company.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "modifier",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      return {
        companies: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Error getting companies:", error);
      throw new Error("Failed to retrieve companies");
    }
  }

  async getCompanyById(id: string) {
    try {
      const company = await Company.findByPk(id, {
        include: [
          {
            model: User,
            as: "modifier",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return company;
    } catch (error) {
      console.error("Error getting company:", error);
      throw error;
    }
  }

  async createCompany(data: { name: string; modifiedBy?: string }) {
    try {
      const company = await Company.create({
        name: data.name,
        modifiedBy: data.modifiedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return company;
    } catch (error) {
      console.error("Error creating company:", error);
      throw new Error("Failed to create company");
    }
  }

  async updateCompany(
    id: string,
    data: { name?: string; modifiedBy?: string }
  ) {
    try {
      const company = await Company.findByPk(id);

      if (!company) {
        throw new Error("Company not found");
      }

      await company.update({
        ...data,
        updatedAt: new Date(),
      });

      return company;
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  }

  async deleteCompany(id: string, modifiedBy?: string) {
    try {
      const company = await Company.findByPk(id);

      if (!company) {
        throw new Error("Company not found");
      }

      await company.destroy();

      return {
        message: "Company deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  }
}

export default new CompanyService();
