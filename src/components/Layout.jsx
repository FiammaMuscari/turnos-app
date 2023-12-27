import React from "react";

import Link from "next/link";

function Layout({ children, loggedInUser, handleLogout }) {
  return (
    <div className="min-h-screen flex flex-col">
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
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

export default Layout;
