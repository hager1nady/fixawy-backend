require("dotenv/config");

const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

const createAdmin = async () => {
  try {
    const email = "admin@fixawy.com";
    const password = "Admin@123456";

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        fullName: "Fixawy Admin",
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        accountStatus: "ACTIVE",
      },
    });

    console.log("Admin created successfully:");
    console.log({
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      accountStatus: admin.accountStatus,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();