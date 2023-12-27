import Image from "next/image";

export default function Header({ global, handleLogout, register, login }) {
  return (
    <>
      {global.currentUsername ? (
        <div>
          <div className="speechBubbleTriangle"></div>
          <div className="instructions">
            <h3 style={{ color: "black" }}>
              Hola {global.currentUsername}, haz doble click para marcar el
              hecho delictivo.
            </h3>
          </div>

          <button className="button logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      ) : (
        <div>
          <div className="container">
            <h2 className="logotext">RobosMDQ</h2>
            <Image
              className="logoimg"
              src="https://cdn-icons-png.flaticon.com/512/3037/3037910.png"
              alt=""
              width={25}
              height={25}
            />
          </div>

          <div className="buttons">
            <button className="login" onClick={login}>
              Ingresar
            </button>
            <button className="register" onClick={register}>
              Registrarse
            </button>
          </div>
          <footer className="footertext">
            <a
              className="links"
              href="https://www.linkedin.com/in/nahuel-santillan/"
            >
              @Nahuel Santillán{" "}
            </a>
            ㅤ ㅤ ㅤ
            <a
              className="links"
              href="https://www.linkedin.com/in/fiamma-muscari/"
            >
              @Fiamma Muscari
            </a>
          </footer>
        </div>
      )}
    </>
  );
}
