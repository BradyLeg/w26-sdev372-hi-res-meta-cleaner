import { audioFile } from "../models/audioFile.js";

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

export const updateMetadata = async (req, res) => {
  try {
    const result = await updateDatabase(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
