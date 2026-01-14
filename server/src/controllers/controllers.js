import { audioFile } from "../models/audioFile.js";
import { user } from "../models/user.js";
import { hashPassword } from "../utils/hashPassword.js";
import { upsertMetadata } from "../repos/repos.js";
import archiver from "archiver";
import fs from "fs";
import path from "path";

// controller function to create new user
export async function createNewUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const password_hash = await hashPassword(password);

    const newUser = await user.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash,
    });

    return res.status(201).json({
      user_id: newUser.user_id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (err) {
    next(err);
  }
}

// controller function to upload audio files
export async function uploadAudio(req, res, next) {
  try {
    const userId = req.user.user_id;
    const files = req.files;

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const audio = await audioFile.create({
          user_id: userId,
          filename: file.filename,
          original_filename: file.originalname,
        });

        return {
          file_id: audio.file_id,
          filename: audio.filename,
          original_filename: audio.original_filename,
        };
      })
    );

    res.status(201).json(uploaded);
  } catch (err) {
    next(err);
  }
}

// controller function to update db with audio file metadata
export const updateMetadata = async (req, res, next) => {
  try {
    await upsertMetadata(req.body);
    res.status(200).json({ message: "Metadata updated successfully" });
  } catch (err) {
    next(err);
  }
};

// controller function to download all audio files for a user
export async function downloadAudio(req, res, next) {
  try {
    const userId = req.user.user_id;

    // Get all audio files for the user
    const userFiles = await audioFile.findAll({
      where: { user_id: userId },
    });

    if (!userFiles || userFiles.length === 0) {
      return res.status(404).json({ error: "No audio files found" });
    }

    // Set response headers for ZIP download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="audio-files-${userId}-${Date.now()}.zip"`
    );

    // Create archiver instance
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Handle archiver errors
    archive.on("error", (err) => {
      next(err);
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each file to the archive
    for (const file of userFiles) {
      const filePath = path.join("uploads", file.filename);

      // Check if file exists before adding
      if (fs.existsSync(filePath)) {
        // Use original filename in the ZIP archive
        archive.file(filePath, { name: file.original_filename });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    // Finalize the archive
    await archive.finalize();
  } catch (err) {
    next(err);
  }
}
