import mongoose from 'mongoose';

const RSSFeedSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    valid: {
        type: Boolean,
        default: false
    }
});

export const RSSFeed = mongoose.model('RSSFeed', RSSFeedSchema);
