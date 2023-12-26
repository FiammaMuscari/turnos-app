import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

export default async function registro(req, res) {
  const prisma = new PrismaClient();

  if (req.method === "POST") {
    try {
      // Generar nueva contraseña
      const salt = await genSalt(10);
      const hashedPassword = await hash(req.body.password, salt);

      // Crear nuevo usuario
      const newUser = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      };

      // Guardar el usuario y responder
      const user = await prisma.user.create({
        data: newUser,
      });

      res.status(200).json(user.id);
    } catch (error) {
      console.error(err); // Loggea el error en la consola del servidor
      res.status(500).json({ error: "Error interno del servidor" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
