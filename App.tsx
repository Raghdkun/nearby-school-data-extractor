
import React, { useState, useCallback } from 'react';
import { AddressInputForm } from './components/AddressInputForm';
import { SchoolList } from './components/SchoolList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { School } from './types';
import { fetchSchoolsNearAddress } from './services/geminiService';
import { exportToCsv } from './utils/csvExporter';

const App: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addressSearched, setAddressSearched] = useState<string>('');

  const handleSearch = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError("Please enter an address.");
      setSchools([]);
      setAddressSearched('');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSchools([]);
    setAddressSearched(address);

    try {
      const fetchedSchools = await fetchSchoolsNearAddress(address);
      setSchools(fetchedSchools);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching school data.');
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    if (schools.length === 0) {
      setError("No school data available to export.");
      return;
    }
    try {
      exportToCsv(`schools_near_${addressSearched.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, schools);
      setError(null); // Clear error if export is successful
    } catch (err) {
      console.error("CSV Export error:", err);
      setError(err instanceof Error ? err.message : "Failed to export CSV.");
    }
  }, [schools, addressSearched]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center p-4 sm:p-8 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-sky-400 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            School Data Extractor
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Enter an address to discover nearby fictional schools using AI and export the data as a CSV file.
        </p>
      </header>

      <main className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        <AddressInputForm onSubmit={handleSearch} isLoading={isLoading} />
        
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && schools.length > 0 && (
          <SchoolList schools={schools} onExportCSV={handleExportCSV} searchedAddress={addressSearched} />
        )}

        {!isLoading && !error && schools.length === 0 && addressSearched && (
          <div className="mt-6 text-center text-slate-400 p-6 bg-slate-700 rounded-md">
            <p className="text-lg">No schools found for "{addressSearched}". Try a different address or broaden your search terms.</p>
          </div>
        )}

        {!isLoading && !error && schools.length === 0 && !addressSearched && (
           <div className="mt-10 text-center text-slate-500 p-8 border-2 border-dashed border-slate-700 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h.008v.008H10.5V6Z" />
            </svg>
            <p className="text-xl font-semibold">Ready to find some schools?</p>
            <p className="text-sm">Enter an address above to begin your search.</p>
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
        <p>Powered by Gemini AI. School data is fictional and for demonstration purposes only.</p>
        <p>&copy; {new Date().getFullYear()} AI School Finder. All rights reserved.</p>
        <p>Made with 💙 by R&D</p>
      </footer>
    </div>
  );
};

export default App;
    