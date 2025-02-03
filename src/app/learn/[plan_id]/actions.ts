import dbConnect from "@/lib/mongodb";
import { LearnerPlan, ILearnerPlan } from "@/lib/models/LearnerPlan";
// write actions for getting the plan, getting a module

export async function getPlan(planId: string): Promise<ILearnerPlan> {
    await dbConnect();
    // Todo : Retrieve only necessary fields
    const plan = await LearnerPlan.findOne({ _id: planId });
    return plan;
}

export async function getLayout(planId: string): Promise<ILearnerPlan> {
    await dbConnect();
    const plan = await LearnerPlan.findOne(
        { _id: planId },
        { "planName":1, "modules.moduleId": 1, "modules.moduleName": 1, "modules.isCompleted": 1 }
    );
    return plan;
}