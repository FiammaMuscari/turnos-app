import Layout from "@/components/Layout";
import axios from "axios";
import { useRef, useState } from "react";

export default function Login() {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/api/users/login", user);
      localStorage.setItem("user", res.data.username);
      console.log(user);
      // Lógica adicional relacionada con el éxito del inicio de sesión
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Layout>
      <div className="loginContainer">
        <form onSubmit={handleSubmit} style={{ height: "150px" }}>
          <input autoFocus placeholder="usuario" ref={usernameRef} />
          <input
            type="password"
            minLength="6"
            placeholder="contraseña"
            ref={passwordRef}
          />
          <button className="loginBtn" type="submit">
            Ingresar
          </button>
          {error && (
            <span className="failure">Usuario o contraseña incorrecta!</span>
          )}
        </form>
      </div>
    </Layout>
  );
}
