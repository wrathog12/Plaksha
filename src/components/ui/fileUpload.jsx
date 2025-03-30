import { cn } from "../../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX, IconCheck } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  onVerify
}) => {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      const newFile = newFiles[0];
      if (newFile.type === "text/pdf" || newFile.type === "text/plain") {
        setFile(newFile);
        if (onChange) {
          onChange([newFile]);
        }
      } else {
        alert("Only PDF and TXT files are supported");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (onChange) {
      onChange([]);
    }
  };

  const handleVerify = (e) => {
    e.stopPropagation();
    if (file && onVerify) {
      setIsVerifying(true);
      setTimeout(() => {
        onVerify(file);
        setIsVerifying(false);
      }, 1000);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    accept: {
      'text/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    onDropRejected: (error) => {
      console.log(error);
      alert("Only PDF and TXT files are supported");
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".csv,.txt"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="inset-0">
        </div>
        <div className="pb-16 px-8">
          <p className="relative z-20 font-sans font-semibold text-blue-500 text-4xl mb-2">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 mt-2 text-xl">
            Drag or drop your PDF or TXT file here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {file ? (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  "relative overflow-hidden z-40 bg-white flex flex-col items-start justify-start md:h-auto p-4 mt-4 w-full mx-auto rounded-md",
                  "shadow-lg"
                )}
              >
                <div className="flex justify-between w-full items-center gap-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="text-base text-neutral-700 truncate max-w-xs"
                  >
                    {file.name}
                  </motion.p>
                  <div className="flex items-center gap-2">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={removeFile}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-500"
                    >
                      <IconX size={16} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="px-1 py-0.5 rounded-md bg-gray-100"
                  >
                    {file.type}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    modified{" "}
                    {new Date(file.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-4 flex justify-end"
                >
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium",
                      isVerifying 
                        ? "bg-blue-400 cursor-not-allowed" 
                        : "bg-blue-500 hover:bg-blue-600"
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <span className="animate-pulse">Verifying...</span>
                      </>
                    ) : (
                      <>
                        <IconCheck size={16} />
                        Verify File
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-gray-200 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-blue-500 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-blue-500 " />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-blue-500" />
                )}
              </motion.div>
            )}

            {!file && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};