"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import Image from "next/image";
import bulkVerify from "../../../public/auth/Signup.svg";
import { FileUpload } from "../../components/ui/fileUpload";
import { IconArrowLeft } from "@tabler/icons-react";

export default function Bulk() {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showPasteEmails, setShowPasteEmails] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!showFileUpload && !showPasteEmails ? (
            <motion.div
              key="verify-section"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white px-8 rounded-xl shadow-lg hover:shadow-xl w-full max-w-5xl text-center border border-gray-200"
            >
              <div className="flex items-center justify-center flex-row">
                <Image
                  alt="verify"
                  src={bulkVerify}
                  width={400}
                  height={250}
                  className="max-w-full max-h-full object-contain"
                />
                <div>
                  <h2 className="text-blue-600 text-4xl font-semibold mb-6">Bulk Verify Emails</h2>
                  <p className="text-gray-600 text-lg mb-8">
                    Quickly verify large volumes of emails to ensure accuracy and boost deliverability. Improve your campaigns with fast, reliable verification.
                  </p>
                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      onClick={() => setShowFileUpload(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setShowPasteEmails(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Paste Emails
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : showFileUpload ? (
            <motion.div
              key="file-upload"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="bg-white px-8 rounded-xl shadow-lg hover:shadow-xl w-full max-w-5xl text-center border border-gray-200"
            >
              <div className="mt-4 mr-4">
                <button
                  onClick={() => setShowFileUpload(false)}
                  className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                >
                  <IconArrowLeft className="mr-1" size={40} />
                </button>
              </div>
              <FileUpload />
            </motion.div>
          ) : (
            <motion.div
              key="paste-emails"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="bg-white px-8 rounded-xl shadow-lg hover:shadow-xl w-full max-w-5xl text-center border border-gray-200"
            >
              <div className="mt-4 mr-4">
                <button
                  onClick={() => setShowPasteEmails(false)}
                  className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                >
                  <IconArrowLeft className="mr-1" size={40} />
                </button>
              </div>
              <PasteEmails />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}