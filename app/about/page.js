import { MapPin, Users, Award, Truck } from "lucide-react";

export const metadata = { title: "About Us | Krishna Textiles" };

const stats = [
  { icon: Users, value: "5,000+", label: "Happy Customers" },
  { icon: Award, value: "10+", label: "Trusted Brands" },
  { icon: MapPin, value: "6+", label: "Textile Hubs Sourced" },
  { icon: Truck, value: "All India", label: "Delivery Coverage" },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-navy-dark text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Our Story
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Krishna Textiles began as a small textile trading business in
            Erode and has grown into a trusted name for quality apparel and
            home textiles, serving customers and retailers across India.
          </p>
        </div>
      </div>

      <div className="container-x py-10 grid sm:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="card p-6 text-center">
            <s.icon className="mx-auto text-navy mb-3" size={26} />
            <p className="text-xl font-extrabold text-navy">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="container-x py-6 grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="font-bold text-navy text-lg mb-3">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To make high-quality, genuine branded textiles accessible to
            every household and business in India — by connecting the
            manufacturing strength of Erode and Tiruppur with a seamless,
            reliable online shopping experience.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-navy text-lg mb-3">Why Choose Us</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Direct sourcing from Erode &amp; Tiruppur manufacturers</li>
            <li>100% genuine products from established brands</li>
            <li>Flexible wholesale &amp; retail purchasing options</li>
            <li>Reliable, tracked delivery across India</li>
            <li>Dedicated customer &amp; business support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
