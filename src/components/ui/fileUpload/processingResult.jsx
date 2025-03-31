// ProcessingResult.jsx
import React from "react";

export const ProcessingResult = ({ result }) => {
  if (!result) return null;
  
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="text-lg font-semibold text-blue-700 mb-2 montserrat-font-medium">Extracted Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-blue-600 font-medium montserrat-font-medium">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span className="text-gray-800 montserrat-font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};