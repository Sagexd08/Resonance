import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * RecommendationService uses a locally hosted transformer model.
 * It expects an executable script (e.g., a Python inference script) at `process.env.LOCAL_MODEL_PATH`.
 * The script should accept a JSON string via stdin and output a JSON array of recommendation strings.
 */
@Injectable()
export class RecommendationService {
    private readonly modelPath: string;

    constructor() {
        this.modelPath = process.env.LOCAL_MODEL_PATH || '';
        if (!this.modelPath) {
            console.warn('LOCAL_MODEL_PATH is not set – RecommendationService will return placeholder data.');
        }
    }

    /**
     * Generate recommendations for a given organization.
     * @param orgId Organization identifier
     * @param context Additional context (e.g., recent team metrics)
     */
    async getRecommendations(orgId: string, context: any): Promise<string[]> {
        if (!this.modelPath) {
            // Fallback placeholder recommendations
            return [
                'Encourage a short walk break after prolonged screen time.',
                'Schedule a team coffee chat to boost engagement.',
                'Offer a mindfulness micro‑session during peak stress periods.',
            ];
        }

        try {
            const input = JSON.stringify({ orgId, context });
            const { stdout } = await execFileAsync('python', [this.modelPath], { input });
            const result = JSON.parse(stdout);
            if (Array.isArray(result)) return result;
            return [];
        } catch (err) {
            console.error('Error invoking local model:', err);
            // Return fallback on error
            return [
                'Consider reviewing workload distribution.',
                'Promote flexible working hours during high‑stress periods.',
            ];
        }
    }
}
