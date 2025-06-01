
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { School } from '../types';

// Ensure API_KEY is handled by the environment, do not ask the user for it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This error should ideally be caught at a higher level or prevent app startup
  console.error("API_KEY for Gemini is not configured. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Use placeholder if missing to avoid crash on init

const parseJsonFromGeminiResponse = (responseText: string): any => {
  let jsonStr = responseText.trim();

  // 1. Remove Markdown fences (e.g., ```json ... ``` or ``` ... ```)
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const fenceMatch = jsonStr.match(fenceRegex);
  if (fenceMatch && fenceMatch[1]) {
    jsonStr = fenceMatch[1].trim();
  }

  // 2. Clean up specific problematic non-ASCII characters between JSON values and structural characters.
  try {
    let prevJsonStr;
    do {
        prevJsonStr = jsonStr;
        jsonStr = jsonStr.replace(/(\b(?:true|false|null)\b|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|"(?:\\.|[^"\\])*")\s*([^\x00-\x7F]+)\s*(?=[,}\]])/g, '$1');
    } while (prevJsonStr !== jsonStr); // Loop if changes were made

  } catch(e) {
    console.error("Error during regex cleaning of JSON response:", e);
  }


  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e);
    console.error("Original Gemini response text (after initial cleaning attempts):", responseText);
    console.error("String attempted to parse:", jsonStr);
    throw new Error(`Could not understand the AI's response. It wasn't valid JSON. Raw after cleaning: ${jsonStr.substring(0,150)}...`);
  }
};

export const fetchSchoolsNearAddress = async (address: string): Promise<School[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Cannot fetch school data.");
  }

  const model = 'gemini-2.5-flash-preview-04-17';
  
  const prompt = `
    Given the address "${address}", please generate a list of AT LEAST 40 fictional schools that could be located nearby.
    It is very important to provide at least 40 school entries.
    For each school, please attempt to provide the following details:
    - name: The fictional name of the school (e.g., "Sunnyvale Elementary", "Northwood High Academy"). This is a required field.
    - address: A plausible fictional street address. This is a required field.
    - type: The type of school (e.g., "Elementary School", "Middle School", "High School", "K-12 School", "Charter School"). This is a required field.
    - studentCount: A fictional number of students enrolled (e.g., between 50 and 3500). This is a required field.
    - phoneNumber: A fictional phone number for the school (e.g., "555-123-4567"). If not available, omit or set to null.
    - principalName: A fictional name for the school principal (e.g., "Dr. Jane Doe"). If not available, omit or set to null.
    - assistantName: A fictional name for the school assistant principal or key administrative staff (e.g., "Mr. John Smith"). If not available, omit or set to null.
    - managerEmail: A fictional email address for the school office or manager (e.g., "office@exampleschool.edu"). If not available, omit or set to null.
    - assistantEmail: A fictional email address for the assistant (e.g., "jsmith@exampleschool.edu"). If not available, omit or set to null.

    Priority is to generate a list of at least 40 schools. If you cannot generate all optional details (phoneNumber, principalName, assistantName, managerEmail, assistantEmail) for every one of the 40+ schools, that is acceptable.
    However, please ensure the core fields (name, address, type, studentCount) are provided for all generated school entries.

    Return the information as a JSON array of objects, where each object represents a school.
    Example format for a single school object:
    {
      "name": "Example School Name",
      "address": "123 Fictional Street, Anytown, USA",
      "type": "Example Type",
      "studentCount": 500,
      "phoneNumber": "555-010-0001",
      "principalName": "Ms. Eleanor Vance",
      "assistantName": "Mr. David Lee",
      "managerEmail": "admin@exampleschool.org",
      "assistantEmail": "d.lee@exampleschool.org"
    }
    Ensure the output is ONLY the JSON array, without any other text, comments, or explanations. The JSON must be strictly valid.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Request JSON output
        temperature: 0.9, // Slightly more creative for more varied fictional data and larger quantity
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
        throw new Error("Received an empty response from the AI.");
    }

    const parsedData = parseJsonFromGeminiResponse(responseText);

    if (!Array.isArray(parsedData)) {
      console.error("Parsed data is not an array:", parsedData);
      throw new Error("AI response was not a list of schools as expected.");
    }

    const schools: School[] = parsedData.map((item: any, index: number) => {
      // Core fields are expected, optional fields can be missing.
      const schoolName = item.name || `Unnamed School ${index + 1}`;
      const schoolAddress = item.address || "Address not provided";
      const schoolType = item.type || "Type not specified";
      const studentCount = typeof item.studentCount === 'number' ? item.studentCount : 0;

      return {
        name: schoolName,
        address: schoolAddress,
        type: schoolType,
        studentCount: studentCount,
        phoneNumber: item.phoneNumber || undefined,
        principalName: item.principalName || undefined,
        assistantName: item.assistantName || undefined,
        managerEmail: item.managerEmail || undefined,
        assistantEmail: item.assistantEmail || undefined,
      };
    }).filter(school => school.name && school.name !== `Unnamed School ${parsedData.indexOf(school) + 1}` && school.address && school.address !== "Address not provided" && school.type && school.type !== "Type not specified"); // Basic filter for minimally valid entries.

    return schools;

  } catch (error) {
    console.error("Error fetching schools from Gemini:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The provided Gemini API key is not valid. Please check your configuration.");
    }
    // Ensure the propagated error message is helpful
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch school data from AI. ${errorMessage}`);
  }
};
