import { audioFile } from "../models/audioFile.js";
import { user } from "../models/user.js";
import bcrypt from "bcrypt";

// controller function to create new user
export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "first name, last name, email, and password are required",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

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
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.error(err);
    return res.status(500).json({ error: "Failed to create user" });
  }
}

// controller function to upload audio files
export async function uploadAudio(req, res) {
  try {
    const userId = req.user.user_id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const audio = await audioFile.create({
        user_id: userId,
        filename: file.filename,
      });

      uploaded.push({
        file_id: audio.file_id,
        filename: audio.filename,
      });
    }

    res.status(201).json(uploaded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}

// controller function to update db with audio file metadata
export const updateMetadata = async (req, res) => {
  try {
    const result = await updateDatabase(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
