import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API placeholders for "Backend Logic"
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // JazzCash Payment Initiation
  app.post("/api/payments/jazzcash/init", (req, res) => {
    const { orderId, amount } = req.body;
    
    const merchantId = process.env.VITE_JAZZCASH_MERCHANT_ID || "MOCK_MERCHANT";
    const password = process.env.VITE_JAZZCASH_PASSWORD || "MOCK_PASSWORD";
    const salt = process.env.JAZZCASH_INTEGRITY_SALT || "MOCK_SALT";
    const returnUrl = process.env.VITE_JAZZCASH_RETURN_URL || `${process.env.APP_URL}/api/payments/jazzcash/callback`;

    const pp_Amount = Math.round(parseFloat(amount) * 100).toString(); // In Paisas
    const pp_TxnDateTime = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];
    const pp_TxnExpiryDateTime = new Date(Date.now() + 3600000).toISOString().replace(/[-:T]/g, "").split(".")[0];
    const pp_TxnRefNo = `T${pp_TxnDateTime}`;

    const params: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: pp_TxnRefNo,
      pp_Amount: pp_Amount,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: pp_TxnDateTime,
      pp_BillReference: orderId,
      pp_Description: `Order ${orderId}`,
      pp_TxnExpiryDateTime: pp_TxnExpiryDateTime,
      pp_ReturnURL: returnUrl,
      pp_SecureHash: "",
      pp_mpf_1: orderId, // Store orderId in custom field
    };

    // Sorted keys for hashing
    const sortedKeys = Object.keys(params).sort();
    let sortedString = salt;
    for (const key of sortedKeys) {
      if (params[key] !== "" && key !== "pp_SecureHash") {
        sortedString += `&${params[key]}`;
      }
    }

    const secureHash = crypto
      .createHmac("sha256", salt)
      .update(sortedString)
      .digest("hex")
      .toUpperCase();

    params.pp_SecureHash = secureHash;

    res.json({
      url: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
      params: params
    });
  });

  // JazzCash Callback (POST from JazzCash)
  app.post("/api/payments/jazzcash/callback", (req, res) => {
    const data = req.body;
    console.log("JazzCash Callback Received:", data);

    // Verify Hash (In production you MUST verify this)
    const salt = process.env.JAZZCASH_INTEGRITY_SALT || "MOCK_SALT";
    const pp_SecureHash = data.pp_SecureHash;
    
    // Logic to verify would go here...
    
    const responseCode = data.pp_ResponseCode;
    const orderId = data.pp_BillReference || data.pp_mpf_1;

    if (responseCode === "000") {
      // Success
      console.log(`Payment successful for order: ${orderId}`);
      // In a real app, you would use Firebase Admin SDK here to update the order
      // But we'll redirect back to the app with a success status
      res.redirect(`/checkout?status=success&orderId=${orderId}`);
    } else {
      // Failure
      console.log(`Payment failed for order: ${orderId}, Code: ${responseCode}`);
      res.redirect(`/checkout?status=failed&error=${data.pp_ResponseMessage}`);
    }
  });

  // Example of server-side inventory injection logic
  app.get("/api/inventory-sync", (req, res) => {
    // In a real app, this might trigger a sync between an ERP and Firestore
    res.json({ message: "Inventory sync capability ready" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexus Commerce Server running on http://localhost:${PORT}`);
  });
}

startServer();
