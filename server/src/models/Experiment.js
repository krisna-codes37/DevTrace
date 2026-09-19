import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema(
  {
    hypothesisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hypothesis',
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DebugSession',
      required: true,
    },
    testDescription: {
      type: String,
      required: true,
      trim: true,
    },
    expectedResult: {
      type: String,
      trim: true,
    },
    actualResult: {
      type: String,
      trim: true,
    },
    evidence: {
      type: String,
      trim: true,
    },
    conclusion: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

experimentSchema.index({ hypothesisId: 1, createdAt: 1 });

const Experiment = mongoose.models.Experiment || mongoose.model('Experiment', experimentSchema);

export default Experiment;
