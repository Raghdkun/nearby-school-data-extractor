
export interface School {
  name: string;
  address: string;
  type: string; // e.g., "Elementary School", "High School"
  studentCount: number;
  // Optional: add more fields if Gemini can provide them reliably
  // principal?: string;
  // yearEstablished?: number;
}

// Used to represent the structure of grounding chunks if using Google Search grounding
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of chunks if applicable
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}
    