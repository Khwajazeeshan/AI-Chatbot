import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'ai']
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    messages: [messageSchema]
},
    {
        timestamps: true,
    }
)

const Chats = mongoose.model("Chats", conversationSchema)
export default Chats