import { NextResponse } from "next/server";
import { requireAdminRequest, handleApiError } from "@/lib/api-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import JobApplication from "@/models/JobApplication";

export async function GET() {
  try {
    const unauthorized = await requireAdminRequest();
    if (unauthorized) return unauthorized;

    await connectToDatabase();

    const [contacts, applications] = await Promise.all([
      ContactSubmission.find({}).sort({ createdAt: -1 }).lean(),
      JobApplication.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      contacts: JSON.parse(JSON.stringify(contacts)),
      applications: JSON.parse(JSON.stringify(applications)),
    });
  } catch (error) {
    return handleApiError(error, "Unable to fetch submissions.");
  }
}
