import { User } from '../models/User.js';

export const isAdmin = async (req, res, next) => {
  try {
    // Fetch the user from the database based on the userId from the request
    const user = await User.findById(req.user.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user's role is 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
