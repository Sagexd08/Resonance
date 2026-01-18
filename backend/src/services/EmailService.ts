/**
 * Email Service - Generates professional meeting excuse emails.
 */
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ExcuseRequest {
  meetingName: string;
  managerName: string;
}

/**
 * Generate a professional meeting excuse email.
 * Uses OpenAI if API key is available, otherwise returns hardcoded template.
 */
export async function generateExcuseEmail(request: ExcuseRequest): Promise<string> {
  const { meetingName, managerName } = request;

  
  if (OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional assistant that writes polite, concise meeting excuse emails. Keep emails under 100 words.",
            },
            {
              role: "user",
              content: `Write a professional email to ${managerName} excusing myself from the meeting "${meetingName}". Make it sound legitimate and professional.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("OpenAI API error, using fallback:", error);
      
    }
  }

  
  const templates = [
    `Hi ${managerName},\n\nI hope this message finds you well. Unfortunately, I won't be able to attend the "${meetingName}" meeting due to a prior commitment that I'm unable to reschedule.\n\nI apologize for any inconvenience this may cause. Please let me know if there's anything I can review beforehand or if you'd like to schedule a brief follow-up.\n\nBest regards`,

    `Dear ${managerName},\n\nI'm writing to inform you that I'll be unable to attend "${meetingName}" due to a scheduling conflict.\n\nI understand the importance of this meeting and would be happy to catch up on any key points discussed. Please share any relevant notes or action items.\n\nThank you for your understanding.\n\nBest regards`,

    `Hi ${managerName},\n\nI need to excuse myself from "${meetingName}" as I have a conflicting appointment that cannot be moved.\n\nI apologize for the short notice and any disruption this may cause. I'll make sure to review any materials shared and follow up if needed.\n\nThanks for understanding.\n\nBest regards`,
  ];

  
  return templates[Math.floor(Math.random() * templates.length)];
}
