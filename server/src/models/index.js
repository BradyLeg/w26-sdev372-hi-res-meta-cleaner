import { AudioFile } from "./AudioFile.js";
import { Metadata } from "./Metadata.js";
import { User } from "./User.js";

// Users One to Many with AudioFiles
User.hasMany(AudioFile, { foreignKey: "user_id" });
AudioFile.belongsTo(User, { foreignKey: "user_id" });

// AudioFile One to One with Metadata
AudioFile.hasOne(Metadata, { foreignKey: "file_id" });
Metadata.belongsTo(AudioFile, { foreignKey: "file_id" });

export { AudioFile, Metadata, User };
