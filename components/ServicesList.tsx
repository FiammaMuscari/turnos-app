import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAllServices } from "@/actions/services";

type Service = {
  id: number;
  name: string;
  price: string;
};

interface ServicesListProps {
  handleServiceSelection: (service: Service) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  handleServiceSelection,
}) => {
  const [serviceList, setServiceList] = useState<
    { id: number; name: string; price: string }[]
  >([]);
  const loadServices = async () => {
    const result = await getAllServices();

    if (result.success) {
      setServiceList(result?.data);
    } else {
      console.error("Error al obtener servicios:", result.error);
    }
  };
  useEffect(() => {
    loadServices();
  }, []);
  return (
    <div>
      {serviceList.length === 0 ? (
        <div>Cargando...</div>
      ) : (
        <ul className="flex gap-[1em]">
          {serviceList.map((service) => (
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
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesList;
