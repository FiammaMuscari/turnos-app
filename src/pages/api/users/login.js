import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

export default async function logearse(req, res) {
  const prisma = new PrismaClient();
  try {
    //find user
    const foundUser = await prisma.users.findUnique({
      where: { username: req.body.username },
    });
    console.log({ foundUser });

    if (foundUser) {
      //if foundUser: compare entered password to stored/foundUser password.
      const validPassword = await compare(
        req.body.password,
        foundUser.password
      );
      if (validPassword) {
        //if both passwords match:
        res.status(200).json({ username: foundUser.username });
      } else {
        //if both passwords dont match:
        res.status(400).json({ err: "Usuario o contraseña incorrecta" });
      }
    } else {
      //if !foundUser:
      res.status(400).json({ err: "Usuario o contraseña incorrecta" });
    }
  } catch (error) {
    res.status(500).json({ error, test: "test" });
  }
}
