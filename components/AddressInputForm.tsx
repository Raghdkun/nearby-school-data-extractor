
import React, { useState } from 'react';

interface AddressInputFormProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export const AddressInputForm: React.FC<AddressInputFormProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <label htmlFor="address" className="block text-sm font-medium text-sky-300 mb-1">
        Enter Address
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA"
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-500 text-slate-100 transition-colors duration-150"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search Schools
            </>
          )}
        </button>
      </div>
    </form>
  );
};
    