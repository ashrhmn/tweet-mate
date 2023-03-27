import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

async function seedUser() {
  await prisma.user.createMany({
    data: [
      {
        username: "ash",
        password: await hash("ash"),
        permissions: [
          "READ_USER",
          "CREATE_USER",
          "MANAGE_USER",
          "CREATE_PROJECT",
          "MANAGE_PROJECT",
        ],
      },
      {
        username: "dev",
        password: await hash("dev"),
        permissions: ["READ_USER"],
      },
      {
        username: "admin",
        password: await hash("admin"),
        permissions: ["ADMIN_PERMISSION"],
      },
    ],
    skipDuplicates: true,
  });
}

async function main() {
  await seedUser();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
