import mongoose from 'mongoose';

const DailyScanSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        default: Date.now
    },
    reloaded: {
        type: Boolean,
        default: false
    }
});

export const DailyScan = mongoose.model('DailyScan', DailyScanSchema);
