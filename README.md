
# Nearby School Data Extractor

## Description

The "Nearby School Data Extractor" is an AI-powered web application designed to find fictional nearby schools based on a user-provided address. It utilizes Google's Gemini API to generate school data and allows users to export this information as a CSV file. This project serves as a demonstration of integrating AI for data generation and frontend application development.

## Features

*   **Address-Based Search:** Enter any address to initiate a search for nearby schools.
*   **AI-Generated School Data:** Leverages the Gemini API to create a list of *fictional* schools, including names, addresses, types (e.g., Elementary, High School), and student counts.
*   **Data Display:** Presents the fetched school data in a clear, tabular format.
*   **CSV Export:** Allows users to download the generated school list as a CSV file for offline use.
*   **Responsive UI:** Built with Tailwind CSS for a responsive experience across different screen sizes.
*   **Loading & Error States:** Provides user feedback during API calls and for any potential errors.

## Tech Stack

*   **Frontend:** React (v19) with TypeScript
*   **Styling:** Tailwind CSS
*   **AI Model:** Google Gemini API (`gemini-2.5-flash-preview-04-17`) via `@google/genai` SDK
*   **Module Loading:** ES Modules via `importmap` in `index.html` (pulling dependencies from `esm.sh`). No build step required for development.

## Prerequisites

*   A modern web browser that supports ES Modules and `importmap`.
*   A valid Google Gemini API Key.

## Getting Started

1.  **Obtain Files:**
    *   Ensure you have all the project files (`index.html`, `index.tsx`, `App.tsx`, `metadata.json`, `types.ts`, and the `components/`, `services/`, `utils/` directories).

2.  **Configure API Key:**
    *   The application requires a Google Gemini API Key to function.
    *   The file `services/geminiService.ts` attempts to read this key from `process.env.API_KEY`.
    *   **In a pure client-side setup like this (opening `index.html` directly), `process.env` is not available.**
    *   **For local development and testing ONLY:** You need to manually set your API key in `services/geminiService.ts`.
        Open `services/geminiService.ts` and replace `process.env.API_KEY` or the placeholder with your actual API key:
        ```typescript
        // In services/geminiService.ts
        // Replace this:
        // const API_KEY = process.env.API_KEY;
        // With this (FOR LOCAL TESTING ONLY):
        const API_KEY = "YOUR_ACTUAL_GEMINI_API_KEY";
        ```
    *   **SECURITY WARNING:**
        *   **Never commit your API key to version control (e.g., Git) if you make this change.**
        *   Hardcoding API keys in client-side code is insecure for production applications. For a real-world deployment, use a backend proxy or serverless function to manage API calls and protect your key.

3.  **Run the Application:**
    *   Simply open the `index.html` file in your web browser.
    *   No `npm install` or build commands are necessary due to the use of `importmap` for dependencies.

## How It Works

1.  The user enters an address into the input field and clicks "Search Schools."
2.  The application calls the `fetchSchoolsNearAddress` function in `services/geminiService.ts`.
3.  This service constructs a prompt for the Gemini API, requesting a list of fictional schools near the given address, formatted as JSON.
4.  The Gemini API processes the request and returns a JSON response containing school data.
5.  The application parses this JSON, cleans it if necessary (e.g., removing Markdown fences or extraneous characters), and validates the structure.
6.  The fetched school data is then displayed in a table on the UI.
7.  The user can click "Export as CSV" to download the school data. The `utils/csvExporter.ts` handles the conversion and download.

## Project Structure

```
.
├── components/                 # React UI components
│   ├── AddressInputForm.tsx    # Form for address input
│   ├── ErrorMessage.tsx        # Component to display errors
│   ├── LoadingSpinner.tsx      # Loading indicator
│   └── SchoolList.tsx          # Displays schools and export button
├── services/                   # External API interaction
│   └── geminiService.ts        # Handles communication with Gemini API
├── utils/                      # Utility functions
│   └── csvExporter.ts          # Logic for CSV conversion and export
├── App.tsx                     # Main React application component
├── index.html                  # HTML entry point, includes importmap
├── index.tsx                   # React root rendering
├── metadata.json               # Application metadata (not used at runtime by client)
├── README.md                   # This file
└── types.ts                    # TypeScript type definitions (e.g., School interface)
```

## Key Components

*   **`App.tsx`**: The main application component that manages state (schools, loading, error), orchestrates data fetching, and renders child components.
*   **`components/AddressInputForm.tsx`**: Provides the input field for the user to enter an address and a submit button.
*   **`components/SchoolList.tsx`**: Renders the list of found schools in a table and includes the "Export as CSV" button.
*   **`components/LoadingSpinner.tsx`**: A visual indicator shown while data is being fetched from the API.
*   **`components/ErrorMessage.tsx`**: Displays error messages to the user in a user-friendly format.
*   **`services/geminiService.ts`**: Contains the logic for interacting with the Google Gemini API, including prompt construction, API call execution, and response parsing/cleaning.
*   **`utils/csvExporter.ts`**: Provides functions to convert the school data array into a CSV formatted string and trigger its download.

## Important Notes

*   **Fictional Data:** All school data generated by the Gemini API is **fictional** and intended for demonstration purposes only. The addresses, school names, and student counts are not real.
*   **API Key Security:** As mentioned in the "Getting Started" section, managing your API key securely is crucial. The method described for local testing (hardcoding) should **not** be used in a production environment or in publicly shared code.
*   **Rate Limiting:** Be mindful of API rate limits if you are making many requests to the Gemini API.

## Potential Future Enhancements

*   **Map Integration:** Use a mapping library (like Google Maps JavaScript API, Leaflet) to display school locations visually.
*   **Advanced Filtering/Sorting:** Allow users to sort schools by name, type, or student count, or filter by school type.
*   **Persistent Storage:** Use browser local storage to save recent searches or results.
*   **UI/UX Improvements:** Enhance visual design, add animations, or improve accessibility.
*   **Real Data Integration (Conceptual):** For a real application, one might explore ways to ground the AI's output with actual (but anonymized or aggregated) datasets if available and permissible, or use Google Search grounding for more context.
*   **Backend Proxy for API Key:** Implement a simple backend service (e.g., using Node.js/Express or a serverless function) to securely manage and use the Gemini API key, rather than exposing it client-side.

## License

To be determined. (Currently, no license is specified).
If this code is shared, consider adding an open-source license like MIT.

---

Made with 💙 by R&D 
