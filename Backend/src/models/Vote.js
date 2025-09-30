import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    anonId: { type: String, default: null },
    optionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// We will enforce uniqueness with checks in code to keep the schema simpler.

export default mongoose.model("Vote", VoteSchema);
