// Importa las bibliotecas necesarias y los componentes
import React, { useState, useEffect } from "react";
import ServicesList from "@/components/ServicesList";

import { useRouter } from "next/router";
import axios from "axios";
import { DatePickerForm } from "@/components/DatePickerForm";
// Definir el componente Home
const Home = () => {
  // Estados para los servicios seleccionados y el precio total
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
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

  //setear globales

  const [global, setGlobal] = useState({
    currentUsername: null,
    date: null,
    time: "",
    is_available: true,
    service_id: null,
  });

  //user login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    setGlobal({ ...global, currentUsername: user });
    //eslint-disable-next-line
  }, []);
  //user logout
  const handleLogout = () => {
    setGlobal({ ...global, currentUsername: null });
    localStorage.removeItem("user");
    console.log("sesion cerrada exitosamente");
  };

  //create appoinment
  //   const handleSubmit = async () => {
  //     const newTurno = {
  //       username: global.currentUsername,
  //       date: global.date,
  //       time: global.time,
  //       is_available: global.available,
  //       service_id: global.service,
  //     }

  //     const res = await axios.post("https://robosmdq.site/api/appointment/create", newTurno)
  //     setGlobal({ ...global, newTurno: null })

  //     if(res.status === 200) {
  //       router.reload()
  //     } ??? no se ni idea, veré

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
          <p>No hay servicios seleccionados</p>
        )}

        <p>Total: $ {totalPrice}</p>
      </div>
      <DatePickerForm />
    </>
  );
};

// Exporta el componente Home
export default Home;
