
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
}; // Added semicolon

export const fetchSchoolsNearAddress = async (address: string): Promise<School[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Cannot fetch school data.");
  }

  const model = 'gemini-2.5-flash-preview-04-17';
  
  const prompt = `
    Given the address "${address}", please generate a list of around 30 to 40 fictional schools that could be located nearby.
    For each school, provide the following details:
    - name: The fictional name of the school (e.g., "Sunnyvale Elementary", "Northwood High Academy").
    - address: A plausible fictional street address. It doesn't need to be hyper-local to the input address, just a general fictional address.
    - type: The type of school (e.g., "Elementary School", "Middle School", "High School", "K-12 School", "Charter School").
    - studentCount: A fictional number of students enrolled (e.g., between 100 and 3000).

    Return the information as a JSON array of objects, where each object represents a school.
    Example format for a single school object:
    {
      "name": "Example School Name",
      "address": "123 Fictional Street, Anytown, USA",
      "type": "Example Type",
      "studentCount": 500
    }
    Ensure the output is ONLY the JSON array, without any other text, comments, or explanations. The JSON must be strictly valid.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Request JSON output
        temperature: 0.7, // Moderately creative
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
      if (typeof item.name !== 'string' || 
          typeof item.address !== 'string' || 
          typeof item.type !== 'string' || 
          typeof item.studentCount !== 'number') {
        console.warn(`School object at index ${index} has an invalid structure:`, item);
        throw new Error(`AI returned an invalid school data structure for item at index ${index}. Name: ${item.name}, Address: ${item.address}, Type: ${item.type}, Count: ${item.studentCount}`);
      }
      return {
        name: item.name,
        address: item.address,
        type: item.type,
        studentCount: item.studentCount,
      };
    });

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
}; // Added semicolon
