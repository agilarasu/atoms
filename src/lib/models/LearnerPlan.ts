import mongoose, { Schema } from 'mongoose';
import LearnerPlanType from '../types/LearnerPlan'; // Import the type

type ILearnerPlan = LearnerPlanType; // Use the imported type

const learnerPlanSchema = new Schema({
    learnerId: {
        type: String,
        required: true,
    },
    planName: {
        type: String,
        required: true,
    },
    overallGoal: {
        type: String,
        required: true,
    },
    learningPhylosophy: {
        type: String,
        required: true,
    },
    learnerProfile: {
        type: new Schema({
            interested_in: {
                type: String,
                required: true,
            },
            motivation: {
                type: String,
                required: true,
            },
            prior_knowledge: {
                type: String,
                required: true,
            },
            experiences: {
                type: String,
                required: true,
            },
            content_preference: {
                type: String,
                required: true,
            },
        }),
    },
    modules: {
        type: [
            {
                moduleId: {
                    type: String,
                    required: true,
                },
                moduleName: {
                    type: String,
                    required: true,
                },
                isCompleted: {
                    type: Boolean,
                    required: true,
                },
                learningGoals: {
                    type: [
                        {
                            goalId: {
                                type: String,
                                required: true,
                            },
                            goal: {
                                type: String,
                                required: true,
                            },
                            isCompleted: {
                                type: Boolean,
                                required: true,
                            },
                        },
                    ],
                    required: true,
                },
                whatUserAlreadyKnow: {
                    type: [String],
                    required: true,
                },
                comparativeFocus: {
                    type: [String],
                    required: true,
                },
                chatId: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
    },
});

const LearnerPlan = mongoose.models.LearnerPlan || mongoose.model<ILearnerPlan>('LearnerPlan', learnerPlanSchema);

export type { ILearnerPlan };
export { LearnerPlan };