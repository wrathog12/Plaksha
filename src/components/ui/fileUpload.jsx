import { cn } from "../../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX, IconCheck, IconFileAnalytics, IconAlertCircle } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

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

export const AccountingFileUpload = ({
  onChange,
  onVerify,
  onSuccess,
  onError,
  apiEndpoint = "/api/process-document" // Default API endpoint
}) => {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null); // Only one type can be selected
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      const newFile = newFiles[0];
      if (
        newFile.type === "image/jpeg" ||
        newFile.type === "image/png"
      ) {
        setFile(newFile);
        setError(null);
        if (onChange) {
          onChange([newFile]);
        }
      } else {
        setError("Only Image files are supported");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
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

  const handleTypeSelection = (type) => {
    // If the type is already selected, deselect it
    if (selectedDocType === type) {
      setSelectedDocType(null);
    } else {
      // Otherwise, select the new type (replacing any existing selection)
      setSelectedDocType(type);
    }
    setError(null);
  };

  const validateSubmission = () => {
    if (!file) {
      setError("Please upload a document first");
      return false;
    }
    
    if (!selectedDocType) {
      setError("Please select a document category");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    
    // Clear any existing errors
    setError(null);
    
    // Validate submission
    if (!validateSubmission()) {
      return;
    }
    
    // Create document type object with only the selected type set to true
    const documentType = {
      bills: selectedDocType === 'bills',
      investment: selectedDocType === 'investment',
      spending: selectedDocType === 'spending'
    };
    
    // Create form data for API request
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', selectedDocType);
    formData.append('documentTypes', JSON.stringify(documentType));
    
    setIsUploading(true);
    
    try {
      // Make API request using axios
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout and retry config if needed
        timeout: 30000, // 30 seconds timeout
      });
      
      // Handle successful response
      if (response.status === 200) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        // Reset form after successful upload
        setFile(null);
        setSelectedDocType(null);
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      
      const errorMessage = error.message || "Failed to upload file. Please try again.";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    onDropRejected: (rejectedFiles) => {
      console.log(rejectedFiles);
      setError("Only PDF and TXT files are supported");
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <IconAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="" {...getRootProps()}>
        <h2 className="text-5xl font-semibold text-blue-500 mb-4 montserrat-font-medium">Upload Document</h2>
        <p className="text-gray-600 mb-4 montserrat-font-medium">Select the type of financial document you're uploading (one category only):</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            onClick={() => handleTypeSelection('bills')}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === 'bills' 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center",
              selectedDocType === 'bills' 
                ? "bg-blue-500 border-blue-500" 
                : "border-gray-400"
            )}>
              {selectedDocType === 'bills' && <IconCheck size={14} className="text-white" />}
            </div>
            <span className="font-medium montserrat-font-medium">Bills & Invoices</span>
          </div>
          
          <div 
            onClick={() => handleTypeSelection('investment')}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === 'investment' 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center",
              selectedDocType === 'investment' 
                ? "bg-blue-500 border-blue-500" 
                : "border-gray-400"
            )}>
              {selectedDocType === 'investment' && <IconCheck size={14} className="text-white" />}
            </div>
            <span className="font-medium montserrat-font-medium">Investments</span>
          </div>
          
          <div 
            onClick={() => handleTypeSelection('spending')}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === 'spending' 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center",
              selectedDocType === 'spending' 
                ? "bg-blue-500 border-blue-500" 
                : "border-gray-400"
            )}>
              {selectedDocType === 'spending' && <IconCheck size={14} className="text-white" />}
            </div>
            <span className="font-medium montserrat-font-medium">Salary</span>
          </div>
        </div>
      </div>

      <div className="" >
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          
          <div className="pb-8">
            <p className="relative z-20 font-sans font-normal text-neutral-500 mt-2 montserrat-font-medium">
              Drag or drop your Image file here or click to upload (one document only)
            </p>
            <div className="relative w-full mt-6 max-w-xl mx-auto ">
              {file ? (
                <motion.div
                  layoutId="file-upload"
                  className={cn(
                    "relative overflow-hidden z-40 bg-gray-50 flex flex-col items-start justify-start md:h-auto p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-md border border-gray-200"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4 montserrat-font-medium">
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

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 montserrat-font-medium">
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
                    className="w-full mt-4 flex justify-end gap-2"
                  >
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying || isUploading}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-blue-500 font-medium border border-blue-500 montserrat-font-medium",
                        (isVerifying || isUploading)
                          ? "bg-blue-50 cursor-not-allowed" 
                          : "bg-transparent hover:bg-blue-50"
                      )}
                    >
                      {isVerifying ? (
                        <>
                          <span className="animate-pulse">Verifying...</span>
                        </>
                      ) : (
                        <>
                          <IconCheck size={16} />
                          Verify
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={isUploading || !file || !selectedDocType}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium montserrat-font-medium",
                        isUploading || !file || !selectedDocType
                          ? "bg-blue-300 cursor-not-allowed" 
                          : "bg-blue-500 hover:bg-blue-600"
                      )}
                    >
                      {isUploading ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        "Process Document"
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div
                    layoutId="file-upload"
                    variants={mainVariant}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={cn(
                      "relative group-hover/file:shadow-xl z-40 bg-gray-100 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md border-2 border-dashed border-gray-300",
                    )}
                  >
                    {isDragActive ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-blue-500 flex flex-col items-center montserrat-font-medium"
                      >
                        Drop it
                        <IconUpload className="h-4 w-4 text-blue-500 " />
                      </motion.p>
                    ) : (
                      <IconUpload className="h-6 w-6 text-blue-500" />
                    )}
                  </motion.div>

                  <p className="text-sm text-gray-500 mt-4 montserrat-font-medium">Supported formats: JPG, PNG</p>
                </div>
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
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2 montserrat-font-medium">
          <IconCheck size={18} className="text-blue-500 mt-1" />
          <div>
            <p className="text-blue-800 font-medium">AI-Powered Accounting</p>
            <p className="text-sm text-blue-600">
              Documents will be processed with OCR to automatically extract and categorize financial data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};