import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Engineering Student",
      text: "This app keeps my classes, budget, and study planner in sync. It feels like having a personal assistant!",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Computer Science",
      text: "The Pomodoro timer and exam prep tools boosted my productivity massively. I’m scoring higher with less stress!",
      rating: 4,
    },
    {
      name: "Emma Wilson",
      role: "Medical Student",
      text: "I love the AI-powered flashcards and smart insights. Learning feels more efficient and less overwhelming.",
      rating: 5,
    },
    {
      name: "James Patel",
      role: "Business Major",
      text: "The budgeting tracker is a lifesaver. I finally saved enough for my textbooks this semester.",
      rating: 4,
    },
    {
      name: "Lina Zhang",
      role: "Design Student",
      text: "The study planner with Kanban board keeps me organized. I never miss deadlines now!",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Law Student",
      text: "The reminders and notifications mean I never miss a lecture or exam again.",
      rating: 5,
    },
    {
      name: "Hannah Lee",
      role: "Psychology Student",
      text: "The wellness tools and motivational quotes really help me stay balanced during exams.",
      rating: 4,
    },
    {
      name: "Aarav Singh",
      role: "Data Science",
      text: "The AI-generated questions from my notes feel like practicing real exams. Super useful!",
      rating: 5,
    },
    {
      name: "Nora Ali",
      role: "Architecture Student",
      text: "Beautiful UI, easy to use, and packed with everything a student could ask for.",
      rating: 5,
    },
  ];

  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-b from-base-100 to-base-200"
    >
      <h2 className="text-4xl font-bold text-center mb-14">
        What Students Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="relative card bg-base-100 border border-gray-200 shadow-xl p-6 
                       hover:shadow-2xl hover:-translate-y-2 transition duration-300 
                       rounded-xl overflow-hidden"
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-xl border-2 border-transparent 
                            bg-gradient-to-r from-primary to-secondary opacity-0 
                            hover:opacity-100 transition duration-500 pointer-events-none"
            />

            <FaQuoteLeft className="text-3xl text-primary opacity-20 absolute top-4 left-4" />
            <p className="text-gray-700 mb-6 italic relative z-10">
              “{t.text}”
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200 relative z-10">
              <FaUserCircle className="text-4xl text-primary" />
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
                <div className="flex text-yellow-500 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
