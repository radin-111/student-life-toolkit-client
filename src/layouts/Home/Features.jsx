import {
  FiCalendar,
  FiPieChart,
  FiEdit3,
  FiCheckSquare,
  FiClock,
  FiMessageSquare,
  FiCode,
  FiFileText,
} from "react-icons/fi";

export default function Features() {
  const features = [
    {
      title: "Class Tracker",
      desc: "Organize your weekly classes with a drag & drop calendar and smart reminders.",
      icon: <FiCalendar className="text-4xl text-blue-500" />,
    },
    {
      title: "Budget Planner",
      desc: "Track income & expenses, visualize spending, and set savings goals easily.",
      icon: <FiPieChart className="text-4xl text-green-500" />,
    },
    {
      title: "Exam Prep",
      desc: "Practice MCQs, true/false, and AI-generated questions from your notes.",
      icon: <FiEdit3 className="text-4xl text-purple-500" />,
    },
    {
      title: "Study Planner",
      desc: "Plan tasks with deadlines, Kanban board, and weekly progress tracking.",
      icon: <FiCheckSquare className="text-4xl text-orange-500" />,
    },
    {
      title: "Productivity Boosters",
      desc: "Stay focused with Pomodoro timer, motivation quotes, and wellness tools.",
      icon: <FiClock className="text-4xl text-pink-500" />,
    },
    {
      title: "Summarizer AI",
      desc: "Paste notes or upload long text and get concise, clear summaries in one click.",
      icon: <FiFileText className="text-4xl text-indigo-500" />,
    },
    {
      title: "AI Assistant",
      desc: "Chat with an intelligent study buddy for quick answers, brainstorming, and guidance.",
      icon: <FiMessageSquare className="text-4xl text-emerald-500" />,
    },
    {
      title: "AI Coder",
      desc: "Generate, debug, and explain code snippets in multiple programming languages.",
      icon: <FiCode className="text-4xl text-red-500" />,
    },
  ];

  return (
    <section className="py-20 bg-base-100" id="features">
      <h2 className="text-4xl font-bold text-center mb-14">
        Everything You Need in One App
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card bg-base-200 shadow-xl p-8 flex flex-col items-center text-center transform hover:scale-105 transition duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
