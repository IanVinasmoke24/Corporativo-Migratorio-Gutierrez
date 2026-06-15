// api/capture-paypal-order.js
const PAYPAL_CLIENT_ID = "AUMttI-WnufgOKikCLcqDGDOx65JU6dW_fjEPSITJyJjthRCLJGYH-KhZNqtVVOxv4UhnzaVulob2tNY";
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY || "EEf227Kahk4hCfV6iB72fJ4kAy2c1DUAha43RtKVTzSt9ZXytLHV5luEl_YbQ3nmNxByOskehSglAjW7";
const BASE_URL = "https://api-m.paypal.com"; // Sandbox: https://api-m.sandbox.paypal.com

async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString("base64");
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error generating access token: ${data.error_description}`);
  }
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { orderID } = req.body;
  if (!orderID) {
    return res.status(400).json({ error: 'Missing orderID' });
  }

  try {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('PayPal Capture Error:', data);
      return res.status(500).json({ error: 'Error capturing PayPal order', detail: data });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
