// endpoint to create a new plan for the user
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { generatePlan } from "@/Agents/Planner";
import { tool as createTool } from 'ai';
import { z } from 'zod';
import LearnerProfile from "@/lib/types/LearnerProfile";
import { LearnerPlan } from "@/lib/models/LearnerPlan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";

const submit_learner_profile = createTool({
    description: 'To submit the learner profile you created',
    parameters: z.object({
        interested_in: z.string(),
        motivation: z. string(),
        prior_knowledge: z.string(),
        experiences: z.string(),
        content_preference: z.string(),
    }),
    execute: async function ({ interested_in, motivation, prior_knowledge, experiences, content_preference }: LearnerProfile) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated.');
        }

        const learnerId = session.user.email;
        const result = await generatePlan({ interested_in, motivation, prior_knowledge, experiences, content_preference });
        result.learnerId = learnerId;

        try {
            await dbConnect();
            const plan = new LearnerPlan(result);
            await plan.save();
            return {
                plan_id: plan._id
            };
        } catch (error) {
            console.error('Error saving learner plan:', error);
            throw new Error('Failed to save learner plan.');
        }
    }
});

const tools = {
    submit_learner_profile: submit_learner_profile
};

const system = `You are tasked to build a learner profile of the user by asking some questions one by one.
Finally build the profile and submit it to the given tool.
Profile fields
{
 "interested_in" : String,
 "motivation" : String,
 "prior_knowledge" : String,
 "experiences" : String,
 "content_preference" : String,
}
`;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const result = streamText({
        model: google('gemini-2.0-flash-exp'),
        system: system,
        tools: tools,
        messages,
        maxSteps: 2
    });
    return result.toDataStreamResponse();
}