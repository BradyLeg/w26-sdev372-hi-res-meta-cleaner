export const updateMetaData = async (req, res) => {
  try {
    res.status(200).send("Hello World");
  } catch {
    res.status(500).json({ error: "Error" });
  }
};
