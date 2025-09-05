import { FaRocket, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import GradientText from "../../Components/GradientText";

export default function CTA() {
  return (
    <section className="relative py-24 bg-base-200 text-center">
      <div className="max-w-5xl mx-auto px-6">
        {/* Headline */}
        <GradientText>
         
            <h1 className="text-5xl font-bold">Take Control of Your Student Journey</h1>
            
        </GradientText>
        <br />

        {/* Supporting text */}
        <p className="text-lg mb-12 text-gray-600">
          Manage your <b>classes</b>, track <b>budget</b>, plan <b>studies</b>,
          and prep for <b>exams</b> — all in one place. Start today and make
          studying easier, smarter, and stress-free.
        </p>

        {/* Quick Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center justify-center gap-3 p-4 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
            <FaCheckCircle className="text-primary text-2xl" />
            <span>Organize Classes</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
            <FaCheckCircle className="text-secondary text-2xl" />
            <span>Track Budget</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-base-200 rounded-lg shadow hover:shadow-lg transition">
            <FaCheckCircle className="text-accent text-2xl" />
            <span>Boost Productivity</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/register"
            className="btn btn-lg px-10 rounded-2xl flex items-center gap-3 text-white font-semibold 
                       bg-gradient-to-r from-primary to-secondary shadow-lg 
                       hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <FaRocket /> Get Started Free
          </Link>
          <Link
            to="/login"
            className="btn btn-lg px-10 rounded-2xl flex items-center gap-3 font-semibold border 
                       border-gray-400 text-base-content shadow-sm 
                       hover:bg-base-200 hover:shadow-md transition duration-300"
          >
            <FaSignInAlt /> Login
          </Link>
        </div>
      </div>
    </section>
  );
}
