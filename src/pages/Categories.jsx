import {
  FaGift,
  FaBirthdayCake,
  FaUsers,
  FaHeart,
  FaMedal,
  FaMagic,
} from "react-icons/fa";

export default function Categories() {
  const categories = [
    {
      icon: <FaGift size={32} />,
      title: "Wedding Planner",
      description:
        "Every wedding weaves a unique tale. Your day, etched as the most unforgettable moment, is crafted for a lifetime of memories.",
    },
    {
      icon: <FaBirthdayCake size={32} />,
      title: "Birthday Parties",
      description:
        "Vibrant birthdays come to life with us. Create cherished memories, surrounded by laughter and joy. Let’s make your special day extraordinary!",
    },
    {
      icon: <FaUsers size={32} />,
      title: "Anniversaries",
      description:
        "Celebrate enduring love and milestones with elegance. Our curated anniversary events capture the essence of your journey, creating timeless memories.",
    },
    {
      icon: <FaHeart size={32} />,
      title: "Engagement Parties",
      description:
        "Embark on the journey to forever with a celebration of love and commitment. Our engagement parties are crafted to make your moment magical and unforgettable.",
    },
    {
      icon: <FaMedal size={32} />,
      title: "Retirement Parties",
      description:
        "Cheers to a new chapter! Honor a lifetime of achievements with a retirement celebration. Let us curate an event that reflects your distinguished career.",
    },
    {
      icon: <FaMagic size={32} />,
      title: "Baby Shower",
      description:
        "Welcome the arrival of joy with a heartwarming baby shower. For a thoughtful details, let's create a magical celebration for the growing family.",
    },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20 font-sans">
    
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-2xl text-black font-semibold font-satisfy">
          Event Categories
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white border hover:border-purple-600 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            <div className="flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600">
              {category.title}
            </h3>
            <p className="text-sm text-grey-600">{category.description}</p>
            <div className="mt-4 text-purple-500 text-sm flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
