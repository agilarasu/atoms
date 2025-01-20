import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/lib/models/plan';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import {z} from 'zod';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}, 'courseName courseDescription createdAt').sort({ createdAt: -1 });
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ message: 'Error fetching plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { whatToLearn, whyToLearn, contentPreferences } = await req.json();

    if (!whatToLearn || !whyToLearn || !contentPreferences) {
      return NextResponse.json(
        { message: 'All form fields are required.' },
        { status: 400 },
      );
    }

    const generatedCourse = await generateObject({
      model: google('gemini-2.0-flash-exp', {}),
      schema: z.object({
      course: z.object({
        courseName: z.string(),
        courseDescription: z.string(),
        courseOutcomes: z.array(z.string()),
        modules: z.array(z.object({ name: z.string(), lessons: z.array(z.string()) })),
      }),
      }),
      system: "  // User input fields\n  whatToLearn: string;\n  whyToLearn: string;\n  contentPreferences: string;\n\nCurate a course for the user in the following format.\nUpto 8 Modules per course Satisfy user needs.\n  courseName: string;\n  courseDescription: string;\n  courseOutcomes: string[];\n  modules: {\n    name: string;\n    lessons: string[];\n  }[];",
      prompt: `What to learn: ${whatToLearn}\nWhy to learn: ${whyToLearn}\nContent preferences: ${contentPreferences}`,
    }); 

    // Create a new Plan document with user inputs and placeholder for the rest
    const plan = new Plan({
      whatToLearn,
      whyToLearn,
      contentPreferences,
      courseName: generatedCourse.object.course.courseName,
      courseDescription: generatedCourse.object.course.courseDescription,
      courseOutcomes: generatedCourse.object.course.courseOutcomes,
      modules: generatedCourse.object.course.modules,
    });

    await plan.save();

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ message: 'Error creating plan' }, { status: 500 });
  }
}