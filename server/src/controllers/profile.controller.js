import streamifier from 'streamifier';
import cloudinary from '../lib/cloudinary.js'; 
import User from '../models/user.model.js';

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'users' },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
                }

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { profilePic: result.secure_url },
                    { new: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                return res.status(200).json(updatedUser);
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
