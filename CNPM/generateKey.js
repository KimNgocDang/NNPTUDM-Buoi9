const { generateKeyPairSync } = require("crypto");
const fs = require("fs");

// tạo key RSA 2048 bits
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// tạo folder nếu chưa có
if (!fs.existsSync("keys")) {
  fs.mkdirSync("keys");
}

// ghi file
fs.writeFileSync("keys/private.key", privateKey);
fs.writeFileSync("keys/public.key", publicKey);

console.log("✅ Tạo key thành công trong thư mục /keys");