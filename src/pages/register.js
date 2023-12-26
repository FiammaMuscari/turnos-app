import Layout from "@/components/Layout";
import React, { useState } from "react";

const Register = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Aquí deberías realizar la lógica de registro del lado del servidor
    // Puedes hacer una solicitud a tu API para crear un nuevo usuario

    // Simulación de registro (sustituye esto con la lógica real)
    const newUser = {
      name,
      email,
      password,
    };

    // Llamar a la función de registro del componente padre (onRegister)
    onRegister(newUser);
  };

  return (
    <Layout>
      <div>
        <h2>Registrarse</h2>
        <label>
          Nombre:
          <input
            className="text-black"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            className="text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Contraseña:
          <input
            className="text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button onClick={handleRegister}>Registrarse</button>
      </div>
    </Layout>
  );
};

export default Register;
