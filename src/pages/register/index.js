import Layout from "@/components/Layout";
import axios from "axios";
import { useRef, useState } from "react";

export default function Register({ global, setGlobal }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/api/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }

    if (!success) {
      ({ currentUsername: newUser.username });
      return;
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="registerContainer">
      <form onSubmit={handleSubmit} style={{ height: "150px" }}>
        <input autoFocus placeholder="usuario" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <div
          style={{
            width: "100%",
            backgroundColor: "#dfdfdf",
            borderRadius: "0.25rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input
            type={passwordShown ? "text" : "password"}
            min="6"
            placeholder="contraseña"
            ref={passwordRef}
            style={{ position: "relative", border: "none" }}
          />
          <button
            onClick={togglePassword}
            style={{
              all: "unset",
              cursor: "pointer",
              right: 0,
              bottom: 0,
              border: "none",
              paddingRight: "0.25rem",
              marginTop: "0.15rem",
            }}
          >
            {passwordShown ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-eye"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-eye-off"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></svg>
            )}
          </button>
        </div>
        <button className="registerBtn" type="submit">
          Registrarme
        </button>
        {success && (
          <span className="success">
            Registro exitoso, ingresa a tu cuenta!
          </span>
        )}
        {error && <span className="failure">Error al registrar!</span>}
      </form>
    </div>
  );
}
