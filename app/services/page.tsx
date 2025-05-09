import React from "react";
import Image from 'next/image';

const services = [
  {
    title: "Women's Salon & Spa",
    img: "/services/women-salon.png", // matches Women's Salon & Spa
    desc: "Women's Salon & Spa",
  },
  {
    title: "Men's Salon & Massage",
    img: "/services/men's salon.png", // matches Men's Salon & Massage
    desc: "Men's Salon & Massage",
  },
  {
    title: "AC & Appliance Repair",
    img: "/services/ac repair.png", // matches AC & Appliance Repair
    desc: "AC & Appliance Repair",
  },
  {
    title: "Cleaning & Pest Control",
    img: "/services/pest control.png", // best match for Cleaning & Pest Control
    desc: "Cleaning & Pest Control",
  },
  {
    title: "Electrician, Plumber & Carpenter",
    img: "/services/electrician.png", // matches Electrician, Plumber & Carpenter
    desc: "Electrician, Plumber & Carpenter",
  },
  {
    title: "Native Water Purifier",
    img: "/services/water purifier.png", // matches Native Water Purifier
    desc: "Native Water Purifier",
  },
  {
    title: "Walls & Rooms Painting",
    img: "/services/painter.png", // matches Walls & Rooms Painting
    desc: "Walls & Rooms Painting",
    badge: "NEW",
  },
  {
    title: "Wall Panels",
    img: "/services/wall-panels.png", // no matching file, keep as is or add image
    desc: "Wall Panels",
  },
  {
    title: "Video Editing",
    img: "/services/video editing.png", // placeholder, add image to public/services/
    desc: "Professional Video Editing Services",
    badge: "NEW",
  },
  {
    title: "Photography",
    img: "/services/photography.png", // placeholder, add image to public/services/
    desc: "Photography for Events and More",
    badge: "NEW",
  },
  {
    title: "Payment Gateway",
    img: "/services/payment-gateway.png", // placeholder, add image to public/services/
    desc: "Seamless and secure online payments for your needs.",
    badge: "NEW",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#18181b]">
      <div className="bg-white/5 rounded-xl p-8 shadow-xl w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-8 text-white">What are you looking for?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
