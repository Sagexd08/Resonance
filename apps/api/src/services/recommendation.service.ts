import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

/**
 * RecommendationService uses a locally hosted transformer model.
 * It expects a Python script at `process.env.LOCAL_MODEL_PATH`.
 * The script should accept JSON via stdin and output a JSON array of recommendation strings.
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
    async getRecommendations(orgId: string, context: Record<string, unknown>): Promise<string[]> {
        if (!this.modelPath) {
            // Fallback placeholder recommendations
            return [
                'Encourage a short walk break after prolonged screen time.',
                'Schedule a team coffee chat to boost engagement.',
                'Offer a mindfulness micro-session during peak stress periods.',
            ];
        }

        return new Promise((resolve) => {
            try {
                const input = JSON.stringify({ orgId, context });
                const python = spawn('python', [this.modelPath]);

                let output = '';
                let errorOutput = '';

                python.stdout.on('data', (data) => {
                    output += data.toString();
                });

                python.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                python.on('close', (code) => {
                    if (code === 0 && output) {
                        try {
                            const result = JSON.parse(output.trim());
                            if (Array.isArray(result)) {
                                resolve(result);
                                return;
                            }
                        } catch {
                            console.error('Failed to parse model output:', output);
                        }
                    }
                    if (errorOutput) {
                        console.error('Model error:', errorOutput);
                    }
                    // Return fallback on error
                    resolve([
                        'Consider reviewing workload distribution.',
                        'Promote flexible working hours during high-stress periods.',
                    ]);
                });

                python.stdin.write(input);
                python.stdin.end();
            } catch (err) {
                console.error('Error invoking local model:', err);
                resolve([
                    'Consider reviewing workload distribution.',
                    'Promote flexible working hours during high-stress periods.',
                ]);
            }
        });
    }
}
