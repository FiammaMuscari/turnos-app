import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Nosotros() {
  return (
    <Layout>
      <div>
        <h1>Acerca de Nosotros</h1>
      </div>
    </Layout>
  );
}
