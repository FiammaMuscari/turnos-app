import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Bienvenido a la Página de Inicio</h1>
      </div>
    </Layout>
  );
}
