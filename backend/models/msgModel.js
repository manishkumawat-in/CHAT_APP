import mongoose from "mongoose";

const msgModelSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MsgModel = mongoose.models.message || mongoose.model("message", msgModelSchema);

export default MsgModel;