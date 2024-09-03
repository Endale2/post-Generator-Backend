import { Setting } from '../models/Setting.js';

export const updateSetting = async (req, res) => {
    try {
        const { context } = req.body;

        await Setting.updateOne({}, { context }, { upsert: true });

        res.status(200).json({ message: 'Setting updated successfully' });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne({});
        if (setting) {
            res.status(200).json(setting);
        } else {
            res.status(404).json({ message: 'No settings found' });
        }
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};