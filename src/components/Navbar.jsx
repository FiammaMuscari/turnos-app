// Nav.js
import React from "react";
import Link from "next/link";

function Navbar({ loggedInUser, handleLogout }) {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/nosotros">Nosotros</Link>
        </li>
        {loggedInUser ? (
          <>
            <li>
              <p>Bienvenido, {loggedInUser}!</p>
            </li>
            <li>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Iniciar sesión</Link>
            </li>
            <li>
              <Link href="/register">Registrarse</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
