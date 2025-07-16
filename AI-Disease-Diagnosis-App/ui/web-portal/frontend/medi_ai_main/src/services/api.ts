
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface SymptomAnalysisRequest {
  text: string;
}

export interface SymptomAnalysisResponse {
  conditions: string[];
  severity: 'moderate' | 'high';
  confidence: number;
}

export const analyzeSymptoms = async (text: string): Promise<SymptomAnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze/symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};
