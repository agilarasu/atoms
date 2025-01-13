import mongoose, { Schema, Document } from 'mongoose';

interface IPlan extends Document {
  // User input fields
  whatToLearn: string;
  whyToLearn: string;
  contentPreferences: string;

  // Backend generated fields (placeholder values initially)
  courseName: string;
  courseDescription: string;
  courseOutcomes: string[];
  modules: {
    name: string;
    lessons: string;
  }[];
  createdAt: Date;
}

const PlanSchema: Schema = new Schema(
  {
    // User input fields
    whatToLearn: { type: String, required: true },
    whyToLearn: { type: String, required: true },
    contentPreferences: { type: String, required: true },

    // Backend generated fields (placeholder values initially)
    courseName: { type: String, default: "Generated Course Name" },
    courseDescription: { type: String, default: "Generated Course Description" },
    courseOutcomes: { type: [String], default: ["Outcome 1", "Outcome 2"] },
    modules: {
      type: [
        {
          name: { type: String, default: "Module 1" },
          lessons: { type: String, default: "Lesson 1" },
        },
      ],
      default: [],
    },
    createdAt: { type: Date, default: Date.now },
  },
);

const Plan =
  (mongoose.models.Plan as mongoose.Model<IPlan>) ||
  mongoose.model<IPlan>('Plan', PlanSchema);
export default Plan;