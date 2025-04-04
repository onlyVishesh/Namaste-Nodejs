const crypto = require("crypto");

const ENCRYPTION_KEY =
  process.env.CHAT_ENCRYPTION_KEY || "default_secret_key_32bytes!"; // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

function decrypt(text) {
  if (!text) return "";
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "base64");
  const encryptedText = textParts.join(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
