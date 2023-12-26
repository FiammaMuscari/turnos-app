import Layout from "@/components/Layout";
import axios from "axios";
import { useRef, useState } from "react";

export default function Login({ setShowLogin, setCurrentUsername, global }) {
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
      setCurrentUsername({ ...global, currentUsername: res.data.username });
      localStorage.setItem("user", res.data.username);
      setShowLogin(false);
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
            min="6"
            placeholder="contraseña"
            ref={passwordRef}
          />
          <button className="loginBtn" type="submit">
            Ingresar
          </button>
          {error && (
            <span className="failure">Usuario o contrañeña incorrecta!</span>
          )}
        </form>
      </div>
    </Layout>
  );
}
