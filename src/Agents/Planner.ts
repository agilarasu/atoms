// uses chain of toughts / prompt chain to build the plan
import LearnerProfile from "@/lib/types/LearnerProfile";
import LearnerPlan from "@/lib/types/LearnerPlan";

// input: learner profile object
// output: learner plan object

const prompt = `Hi learnerName, I am your learning assistant.`;

export async function generatePlan(learnerProfile: LearnerProfile): Promise<LearnerPlan> {
    // generate plan
    // return plan
    return new Promise<LearnerPlan>((resolve) => {
        setTimeout(() => {
            resolve({
                planId: "planId",
                learnerId: "learnerId",
                planName: "planName",
                overallGoal: "overallGoal",
                learningPhylosophy: "learningPhylosophy",
                learnerProfile: "learnerProfile",
                modules: [
                {
                    moduleId: "moduleId",
                    moduleName: "moduleName",
                    isCompleted: false,
                    learningGoals: [
                    {
                        goalId: "goalId",
                        goal: "goal",
                        isCompleted: false,
                    },
                    ],
                    whatUserAlreadyKnow: ["whatUserAlreadyKnow"],
                    comparativeFocus: ["comparativeFocus"],
                    chatId: "chatId",
                },
                ],
            });
        }, 3000);
    });
}