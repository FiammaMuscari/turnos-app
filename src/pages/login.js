import Layout from "@/components/Layout";
import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aquí deberías realizar la lógica de autenticación del lado del servidor
    // Puedes hacer una solicitud a tu API para verificar las credenciales

    // Simulación de autenticación (sustituye esto con la lógica real)
    const isAuthenticated = true;

    if (isAuthenticated) {
      // Llamar a la función de inicio de sesión del componente padre (onLogin)
      onLogin(email);
    } else {
      // Manejar el caso en el que la autenticación falla
      alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Layout>
      <div>
        <h2>Iniciar Sesión</h2>
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
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </Layout>
  );
};

export default Login;
