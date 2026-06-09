// api/create-preference.js
// Vercel Serverless Function – CMG MercadoPago Checkout
// -------------------------------------------------------
// Recibe el carrito del frontend, crea una preferencia de
// pago en MercadoPago y devuelve la URL de checkout.

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export default async function handler(req, res) {
  // Permitir CORS para que el frontend pueda llamar esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  // Construir los ítems en el formato que espera MercadoPago
  const mpItems = items.map(item => ({
    id: item.id,
    title: item.name,
    quantity: item.qty,
    unit_price: item.price,
    currency_id: 'MXN',
  }));

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: mpItems,
        back_urls: {
          success: 'https://tu-dominio.com/#servicios', // ← cambia por tu URL
          failure: 'https://tu-dominio.com/#servicios',
          pending: 'https://tu-dominio.com/#servicios',
        },
        auto_return: 'approved',
        statement_descriptor: 'CMG Corporativo Migratorio',
        metadata: {
          source: 'cmg-website',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error MercadoPago:', data);
      return res.status(500).json({ error: 'Error al crear el pago', detail: data });
    }

    // init_point = URL de pago de producción
    return res.status(200).json({ checkout_url: data.init_point });

  } catch (err) {
    console.error('Error servidor:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
