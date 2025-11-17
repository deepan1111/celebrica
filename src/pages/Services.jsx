import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/servicesData.json")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Failed to load services data:", err));
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20 font-sans">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-2xl text-black font-semibold font-satisfy">
          Services We Offer
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border p-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group"
          >
            <div className="cover h-48 flex items-center justify-center mb-4">
              <img
                src={service.image}
                alt={service.title}
                className="object-cover h-full w-full rounded-xl"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
              {service.title}
            </h3>
            <p className="text-sm p-4 text-left text-gray-600 font-poppins">
              {service.description}
            </p>
            <div className="space-x-3 justify-between p-2 hidden md:flex">
              <p className="text-sm font-bold p-2 text-left font-poppins text-zinc-800">
                {service.cost}
              </p>
              <Link
                to={`/event/${service.id}`}
                className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-gray-900 hover:text-white"
              >
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
