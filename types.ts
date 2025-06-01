
export interface School {
  name: string;
  address: string;
  type: string; // e.g., "Elementary School", "High School"
  studentCount: number;
  phoneNumber?: string;
  principalName?: string;
  assistantName?: string; // e.g., Assistant Principal
  managerEmail?: string; // e.g., School administrator/office manager email
  assistantEmail?: string; // e.g., Assistant's email
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