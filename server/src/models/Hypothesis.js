import mongoose from 'mongoose';

const hypothesisSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DebugSession',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reasoning: {
      type: String,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['UNTESTED', 'TESTING', 'CONFIRMED', 'REJECTED', 'INCONCLUSIVE'],
    },
  },
  { timestamps: true },
);

hypothesisSchema.index({ sessionId: 1, createdAt: 1 });

const Hypothesis = mongoose.models.Hypothesis || mongoose.model('Hypothesis', hypothesisSchema);

export default Hypothesis;
