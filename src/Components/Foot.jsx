import React from "react";
import { Link } from "react-router";
import { SiFacebook } from "react-icons/si";
import { TbXboxXFilled } from "react-icons/tb";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const Foot = () => {
  return (
    <footer className="w-full flex flex-col md:px-20 md:py-10 px-4 py-8 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
      <img
        src="https://i.ibb.co.com/s9J7m3XX/image-1.jpg"
        alt="RestoFlow Logo"
        className="w-[100px] h-[100px] rounded-2xl mx-auto mb-4 object-cover"
      />
      <h1 className="text-3xl font-extrabold text-center mb-1">HappyLearn</h1>
      <p className="text-center mb-6 text-gray-300 max-w-md mx-auto">
        Best platform for students <br />
        
      </p>
      <h2 className="text-center text-lg font-semibold mb-4">
        Join us on social media
      </h2>
      <div className="flex items-center justify-center gap-10 mb-8">
        <Link
          to="https://m.facebook.com/profile.php?id=61554372099239"
          aria-label="Facebook"
        >
          <SiFacebook
            size={40}
            className="hover:text-purple-400 transition-colors"
          />
        </Link>
        <Link aria-label="Xbox">
          <TbXboxXFilled
            size={45}
            className="hover:text-purple-400 transition-colors"
          />
        </Link>
        <Link aria-label="YouTube">
          <FaYoutube
            size={45}
            className="hover:text-purple-400 transition-colors"
          />
        </Link>
        <Link aria-label="LinkedIn">
          <FaLinkedinIn
            size={45}
            className="hover:text-purple-400 transition-colors"
          />
        </Link>
      </div>
      <p className="text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} HappyLearn. All rights reserved.
      </p>
    </footer>
  );
};

export default Foot;
