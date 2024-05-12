import express from "express";
import cors from "cors";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-1777283701257315-051120-4d28b102c0ab01f5a9d7156b2be405a1-1809816578",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create_preference", async (req, res) => {
  try {
    const idempotencyKey = req.headers["x-idempotency-key"];
    console.log(idempotencyKey)

    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.unit_price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://utopiastw.com/",
        failure: "https://utopiastw.com/",
        pending: "https://utopiastw.com/",
      },
      auto_return: "approved",
    };

    console.log(body);

    const preference = new Preference(client);
    const result = await preference.create({ body, idempotencyKey });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        error: "Error al crear la preferencia"
    })
  }
});

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});