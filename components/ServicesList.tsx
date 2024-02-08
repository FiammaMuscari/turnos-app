import React, { useState, useEffect } from "react";
import { getAllServices } from "@/actions/services";

type Service = {
  id: string;
  name: string;
  price: string;
};

interface ServicesListProps {
  handleServiceSelection: (service: Service) => void;
  selectedServices: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({
  handleServiceSelection,
  selectedServices,
}) => {
  const [serviceList, setServiceList] = useState<Service[]>([]);

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
    <div className="flex justify-center">
      {serviceList.length === 0 ? (
        <div className="text-white">Cargando...</div>
      ) : (
        <ul className="flex gap-[1em]">
          {serviceList.map((service) => (
            <li
              key={service.id}
              className={` p-4 rounded-sm cursor-pointer ${
                isSelected(service)
                  ? "bg-white text-blue-400"
                  : "bg-slate-200 text-black"
              }`}
            >
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  value={service.id}
                  checked={isSelected(service)}
                  onChange={() => handleServiceSelection(service)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    height: 0,
                    width: 0,
                  }}
                />
                <div className="flex flex-col ">
                  <h3 className="text-center">
                    {service.name.charAt(0).toUpperCase() +
                      service.name.slice(1)}
                  </h3>
                  <p className="">
                    {parseFloat(service.price).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  function isSelected(selectedService: Service): boolean {
    return selectedServices.some(
      (service) => service.id === selectedService.id
    );
  }
};

export default ServicesList;
