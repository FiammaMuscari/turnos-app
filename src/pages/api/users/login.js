import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

export default async function login(req, res) {
  const prisma = new PrismaClient();

  try {
    if (req.method === "POST") {
      // Buscar usuario por nombre de usuario
      const foundUser = await prisma.user.findUnique({
        where: { username: req.body.username },
      });

      if (foundUser) {
        // Comparar contraseñas
        const validPassword = await compare(
          req.body.password,
          foundUser.password
        );

        if (validPassword) {
          res
            .status(200)
            .json({ username: foundUser.username, userId: foundUser.id });
        } else {
          res.status(400).json({ err: "1" });
        }
      } else {
        res.status(400).json({ err: "2" });
      }
    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
