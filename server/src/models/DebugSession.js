import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    technology: {
      type: String,
      trim: true,
    },
    projectName: {
      type: String,
      trim: true,
    },
    environment: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'SOLVED', 'ARCHIVED'],
    },
    tags: {
      type: [String],
    },
    rootCause: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    lessonLearned: {
      type: String,
      trim: true,
    },
    solvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ userId: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ technology: 1 });
sessionSchema.index({ createdAt: 1 });
sessionSchema.index({ userId: 1, updatedAt: -1 });

const DebugSession = mongoose.models.DebugSession || mongoose.model('DebugSession', sessionSchema);

export default DebugSession;
