// uses chain of toughts / prompt chain to build the plan
import LearnerProfile from "@/lib/types/LearnerProfile";
import LearnerPlan from "@/lib/types/LearnerPlan";
import { generateObject } from 'ai';
import { google } from "@ai-sdk/google";
import { z } from 'zod';

const prompt = `Create a learning plan for a learner with the following profile:`;

export async function generatePlan(learnerProfile: LearnerProfile): Promise<LearnerPlan> {
    // use a chain here instead of a single prompt
    const { object } = await generateObject({
        model: google("gemini-2.0-flash-exp"), // change later
        schema: z.object({
            learnerProfile: z.object({
                planName: z.string(),
                overallGoal: z.string(),
                learningPhylosophy: z.string(),
                modules: z.array(z.object({
                    moduleId: z.string(),
                    moduleName: z.string(),
                    learningGoals: z.array(z.object({
                        goalId: z.string(),
                        goal: z.string(),
                    })),
                    whatUserAlreadyKnow: z.array(z.string()),
                    comparativeFocus: z.array(z.string()),
                })),
            }),
        }),
        prompt: prompt + JSON.stringify(learnerProfile),
    });

    // add other fields
    return {
        learnerId: "learnerId", // will be updated where it is used
        planName: object.learnerProfile.planName,
        overallGoal: object.learnerProfile.overallGoal,
        learningPhylosophy: object.learnerProfile.learningPhylosophy,
        learnerProfile: learnerProfile,
        modules: object.learnerProfile.modules.map((module: any) => {
            return {
                moduleId: module.moduleId,
                moduleName: module.moduleName,
                isCompleted: false, // add manually
                learningGoals: module.learningGoals.map((goal: any) => {
                    return {
                        goalId: goal.goalId,
                        goal: goal.goal,
                        isCompleted: false, // add manually
                    };
                }),
                whatUserAlreadyKnow: module.whatUserAlreadyKnow,
                comparativeFocus: module.comparativeFocus,
                chatId: "chatId", // create a new chat and use its ObjectID
            };
        }),
    };
}