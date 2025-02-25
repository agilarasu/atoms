import LearnerProfile from "./LearnerProfile";

interface LearnerPlan {
    learnerId: string; // Object ID
    planName: string;
    overallGoal: string;
    learningPhylosophy: string;
    learnerProfile: LearnerProfile;
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