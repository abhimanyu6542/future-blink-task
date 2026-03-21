import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  prompt: string;
  response: string;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>("Conversation", ConversationSchema);
