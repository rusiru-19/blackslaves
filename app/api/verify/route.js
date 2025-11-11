import admin from "@/lib/firebase-admin";



export default async function handler(req, res) {
  const token = req.cookies.token;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
