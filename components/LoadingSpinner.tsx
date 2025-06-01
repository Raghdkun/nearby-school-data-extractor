
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-sky-500"></div>
      <p className="ml-4 text-lg text-slate-300">Loading school data...</p>
    </div>
  );
};
    