import express from "express";
import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Create poll (auth required)
router.post("/", optionalAuth, requireAuth, async (req, res, next) => {
  try {
    const { question, options = [], isPublic = true } = req.body;
    if (!question || !Array.isArray(options)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const filtered = options
      .map((o) => ({ text: String(o).trim() }))
      .filter((o) => o.text);

    if (filtered.length < 2 || filtered.length > 4) {
      return res.status(400).json({ message: "Provide 2-4 options" });
    }

    const poll = await Poll.create({
      question: question.trim(),
      options: filtered,
      createdBy: req.user._id,
      isPublic: !!isPublic,
    });

    res.json({ poll });
  } catch (err) {
    next(err);
  }
});

// Get polls created by logged-in user
router.get("/", optionalAuth, requireAuth, async (req, res, next) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ polls });
  } catch (err) {
    next(err);
  }
});

// Get poll by ID
// Optional query param: anonId (to check if caller already voted)
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId).lean();
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    let voted = false;
    if (req.user) {
      const existing = await Vote.findOne({ pollId, userId: req.user._id });
      if (existing) voted = true;
    } else if (req.query.anonId) {
      const existing = await Vote.findOne({ pollId, anonId: req.query.anonId });
      if (existing) voted = true;
    }

    res.json({ poll, voted });
  } catch (err) {
    next(err);
  }
});

// Vote on a poll (no transactions needed)
router.post("/:id/vote", optionalAuth, async (req, res, next) => {
  try {
    const pollId = req.params.id;
    const { optionId, anonId } = req.body;
    const userId = req.user ? req.user._id : null;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!poll.isPublic && !userId) {
      return res.status(401).json({ message: "Login required to vote" });
    }

    // Check if already voted
    if (userId) {
      const existing = await Vote.findOne({ pollId, userId });
      if (existing) return res.status(400).json({ message: "Already voted" });
    } else {
      if (!anonId)
        return res
          .status(400)
          .json({ message: "anonId required for anonymous voting" });
      const existing = await Vote.findOne({ pollId, anonId });
      if (existing) return res.status(400).json({ message: "Already voted" });
    }

    // Verify option belongs to poll
    const option = poll.options.id(optionId);
    if (!option) return res.status(400).json({ message: "Invalid option" });

    // Save vote
    await Vote.create({
      pollId,
      userId: userId || null,
      anonId: userId ? null : anonId,
      optionId,
    });

    // Increment option count
    await Poll.updateOne(
      { _id: pollId, "options._id": optionId },
      { $inc: { "options.$.votes": 1 } }
    );

    // Fetch updated poll
    const updatedPoll = await Poll.findById(pollId).lean();

    // Broadcast update via socket.io (if enabled)
    const io = req.app.get("io");
    if (io) {
      io.to(`poll:${pollId}`).emit("voteUpdate", {
        pollId,
        options: updatedPoll.options,
      });
    }

    res.json({ success: true, poll: updatedPoll });
  } catch (err) {
    next(err);
  }
});

export default router;
