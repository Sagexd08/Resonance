/**
 * ML Service - Communicates with AWS Lambda ML inference endpoint.
 */
import axios, { AxiosError } from "axios";
import FormData from "form-data";

const ML_LAMBDA_URL = process.env.ML_LAMBDA_URL || "";

if (!ML_LAMBDA_URL) {
  console.warn("⚠ ML_LAMBDA_URL not set. ML predictions will fail.");
}

export interface BiometricAnalysis {
  stress: number;
  fatigue: number;
}

/**
 * Analyze biometrics (audio and image) by sending to Lambda ML service.
 * 
 * @param audioBuffer - Audio file buffer
 * @param imageBuffer - Image file buffer
 * @returns Analysis results with stress and fatigue scores
 */
export async function analyzeBiometrics(
  audioBuffer: Buffer,
  imageBuffer: Buffer
): Promise<BiometricAnalysis> {
  if (!ML_LAMBDA_URL) {
    throw new Error("ML_LAMBDA_URL environment variable not set");
  }

  try {
    // Send audio to Lambda
    const audioForm = new FormData();
    audioForm.append("file", audioBuffer, {
      filename: "voice.wav",
      contentType: "audio/wav",
    });

    const audioResponse = await axios.post(
      `${ML_LAMBDA_URL}/predict/voice`,
      audioForm,
      {
        headers: {
          ...audioForm.getHeaders(),
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Send image to Lambda
    const imageForm = new FormData();
    imageForm.append("file", imageBuffer, {
      filename: "face.jpg",
      contentType: "image/jpeg",
    });

    const imageResponse = await axios.post(
      `${ML_LAMBDA_URL}/predict/fatigue`,
      imageForm,
      {
        headers: {
          ...imageForm.getHeaders(),
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return {
      stress: audioResponse.data.stress_score ?? 0.5,
      fatigue: imageResponse.data.fatigue_score ?? 0.5,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("ML Service Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      if (axiosError.code === "ECONNABORTED") {
        throw new Error("ML service timeout - please try again");
      }

      if (axiosError.response?.status === 503) {
        throw new Error("ML service unavailable - models not loaded");
      }

      throw new Error(`ML service error: ${axiosError.message}`);
    }

    throw error;
  }
}
