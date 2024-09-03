import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    context: { type: String, required: true },  
});

export const Setting = mongoose.model('Setting', settingSchema);
