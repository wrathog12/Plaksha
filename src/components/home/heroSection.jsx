import React from "react";
import { Vortex } from "../ui/vortex";
import {ChatbotInterface} from "./chatbotInterface"

export function HeroSection() {
  return (
    <div className="w-full mx-auto h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-5xl md:text-8xl text-center clash-font-medium">
          Say Goodbye to Accountants
        </h2>
        <p className="text-white text-base md:text-3xl max-w-3xl mt-6 text-center mb-8 montserrat-font-medium ">
          Eliminate the need for traditional accountants. Our AI handles your
          financial year tax-saving strategies—smarter, faster, and cheaper.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] montserrat-font-medium text-lg">
            Use For Free
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] montserrat-font-medium text-lg">Get Started</button>
        </div>
      </Vortex>
      <ChatbotInterface />
    </div>
  );
}
