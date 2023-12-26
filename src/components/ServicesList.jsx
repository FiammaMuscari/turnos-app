import React, { useState, useEffect } from "react";

const ServicesList = ({ handleServiceSelection }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener los servicios
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error al obtener servicios:", error));
  }, []);

  return (
    <ul>
      {services.map((service) => (
        <li key={service.id}>
          <label>
            <input
              type="checkbox"
              value={service.id}
              onChange={() => handleServiceSelection(service)}
            />
            {service.name} - ${service.price}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default ServicesList;
