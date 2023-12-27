// Importa las bibliotecas necesarias y los componentes
import React, { useState, useEffect } from "react";
import ServicesList from "@/components/ServicesList";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import axios from "axios";
// Definir el componente Home
const Home = () => {
  // Estados para los servicios seleccionados y el precio total
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Función para manejar la selección de servicios
  const handleServiceSelection = (selectedService) => {
    const isServiceSelected = selectedServices.some(
      (service) => service.id === selectedService.id
    );

    if (isServiceSelected) {
      const updatedServices = selectedServices.filter(
        (service) => service.id !== selectedService.id
      );
      setSelectedServices(updatedServices);
    } else {
      const updatedServices = [...selectedServices, selectedService];
      setSelectedServices(updatedServices);
    }
  };

  // Efecto para actualizar el precio total cuando cambian los servicios seleccionados
  useEffect(() => {
    const total = selectedServices.reduce(
      (accumulator, service) => accumulator + service.price,
      0
    );
    setTotalPrice(total);
  }, [selectedServices]);

  return (
    <Layout>
      <h1 className="mb-3">Hola, ¿Qué deseas hacerte?</h1>
      <ServicesList handleServiceSelection={handleServiceSelection} />
      <div className="max-w-80">
        <h2>A pagar:</h2>

        {selectedServices.length > 0 ? (
          selectedServices.map((service) => (
            <ul key={service.id} className="flex justify-end">
              <li>{service.name}</li>
              <li>.......... ${service.price}</li>
            </ul>
          ))
        ) : (
          <p>No hay servicios seleccionados</p>
        )}

        <p>Total: $ {totalPrice}</p>
      </div>
    </Layout>
  );
};

// Exporta el componente Home
export default Home;
