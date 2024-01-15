"use client";

import React, { useState } from "react";
import ServicesList from "@/components/ServicesList";
import { DatePickerForm } from "@/components/DatePickerForm";

interface Service {
  id: number;
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

  return (
    <>
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
          <div>No hay servicios seleccionados</div>
        )}

        <div>Total: $ {totalPrice}</div>
      </div>
      <DatePickerForm />
    </>
  );
};

// Exporta el componente ClientPage
export default ClientPage;