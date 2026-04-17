import { models, model } from "mongoose";
import { createContentSchema } from "./shared";

// Note: slug unique index is already created via `unique: true` in contentSchemaFields
// Do NOT add careerSchema.index({ slug: 1 }) here — it causes a duplicate index warning
const careerSchema = createContentSchema({
  location: { type: String, default: "Remote" },
  employmentType: { type: String, default: "Full-Time" },
  department: { type: String, default: "General" },
  salaryRange: { type: String, default: "" },
});

careerSchema.index({ department: 1 });

const Career = models.Career || model("Career", careerSchema);
export default Career;
