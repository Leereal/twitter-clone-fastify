import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

export async function findUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

// export async function updateUser(id: number, input: CreateUserInput) {
//   const { password, salt,...rest } = input;
//   const { hash } = hashPassword(password, salt);

//   const user = await prisma.user.update({
//     where: { id },
//     data: { password: hash,...rest },
//   });
//   return user;
// }

export async function deleteUser(id: number) {
  const user = await prisma.user.delete({
    where: { id },
  });
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
}
