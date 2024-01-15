import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Service {
  id: number;
  name: string;
  price: string;
}

interface ServicesListProps {
  handleServiceSelection: (service: Service) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  handleServiceSelection,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Llamada a la API para obtener los servicios
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error al obtener servicios:", error));
  }, []);

  return (
    <div>
      {services.length === 0 ? (
        <div>No hay servicios disponibles en este momento.</div>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id} className="serviceCard">
              <label className="serviceLabel">
                <input
                  type="checkbox"
                  value={service.id}
                  onChange={() => handleServiceSelection(service)}
                />
                <div className="serviceInfo">
                  <h3 className="serviceName">{service.name}</h3>
                  <p className="servicePrice">${service.price}</p>
                </div>
                <div className="serviceImage">
                  <Image
                    src={`/images/services/${service.id}.webp`}
                    alt={service.name}
                    width={100}
                    height={100}
                  />
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesList;
