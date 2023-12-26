import React, { useState, useEffect } from "react";
import ServicesList from "@/components/ServicesList";
import Layout from "@/components/Layout";

const Home = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    const total = selectedServices.reduce(
      (accumulator, service) => accumulator + service.price,
      0
    );
    setTotalPrice(total);
  }, [selectedServices]);

  return (
    <Layout>
      <h1>Bienvenido a la Página de Inicio</h1>
      <ServicesList handleServiceSelection={handleServiceSelection} />
      <div>
        <h2>Servicios Seleccionados</h2>
        <ul>
          {selectedServices.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
        <p>Total: ${totalPrice}</p>
      </div>
    </Layout>
  );
};

export default Home;
