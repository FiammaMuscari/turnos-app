// Layout.js
import React, { useMemo } from "react";
import Navbar from "./Navbar";
import Head from "next/head";

function Layout({ children, loggedInUser, handleLogout }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>turnos</title>
      </Head>
      <main className="flex-1 p-4">
        <Navbar loggedInUser={loggedInUser} handleLogout={handleLogout} />
        {children}
      </main>
    </div>
  );
}

export default Layout;
