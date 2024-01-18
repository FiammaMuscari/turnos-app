"use client";

import React, { useEffect, useState } from "react";
import ServicesList from "@/components/ServicesList";
import { DatePickerForm } from "@/components/DatePickerForm";

interface Service {
  id: string;
  name: string;
  price: string;
}

const ClientPage: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // selección de servicios
  const handleServiceSelection = (selectedService: Service) => {
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

  // Calcular el precio total cuando los servicios seleccionados cambian
  useEffect(() => {
    const total = selectedServices.reduce(
      (accumulator, service) => accumulator + parseFloat(service.price),
      0
    );
    setTotalPrice(total);
  }, [selectedServices]);

  return (
    <>
      <h1 className="mb-3 text-white">Hola, ¿Qué deseas hacerte?</h1>
      <ServicesList
        handleServiceSelection={handleServiceSelection}
        selectedServices={selectedServices}
      />
      <div className="max-w-80 bg-white rounded-sm p-4 m-3">
        <h2>A pagar:</h2>

        {selectedServices.length > 0 ? (
          selectedServices.map((service) => (
            <ul key={service.id} className="flex justify-end">
              <li>{service.name}</li>
              <li>.......... ${service.price}</li>
            </ul>
          ))
        ) : (
          <div>No hay servicios seleccionados</div>
        )}

        <div className="text-blue-400">Total: $ {totalPrice}</div>
      </div>
      <DatePickerForm />
    </>
  );
};

// Exporta el componente ClientPage
export default ClientPage;
