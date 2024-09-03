import mongoose from 'mongoose';

const PreviewSchema = new mongoose.Schema({
    title: String,
    content: String,
    link: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

PreviewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });  // Automatically delete after 24 hours

export const Preview = mongoose.model('Preview', PreviewSchema);
