import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
