import mongoose from 'mongoose';

const TodaysPostSchema = new mongoose.Schema({
    posts: [
        {
            title: String,
            content: String,
            link: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const TodaysPost = mongoose.model('TodaysPost', TodaysPostSchema);
