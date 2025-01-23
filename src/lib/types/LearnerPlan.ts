interface LearnerPlan {
    planId: string; // Object ID
    learnerId: string; // Object ID
    planName: string;
    overallGoal: string;
    learningPhylosophy: string;
    learnerProfile: string; // Object ID
    modules: {
        moduleId: string;
        moduleName: string;
        isCompleted: boolean;
        learningGoals: {
            goalId: string;
            goal: string;
            isCompleted: boolean;
        }[];
        whatUserAlreadyKnow: string[];
        comparativeFocus: string[];
        chatId: string;
    }[];
}

export default LearnerPlan;