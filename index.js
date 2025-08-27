const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/whatsapp', (req, res) => {
  const twiml = new MessagingResponse();

  const msg = req.body.Body ? req.body.Body.toLowerCase().trim() : "";

  if (msg.includes("hola")) {
    twiml.message("👋 ¡Hola! Bienvenido a nuestro bot de prueba. ¿Quieres conocer nuestros *horarios*, *precios* o más *info*?");
  } else if (msg.includes("horario")) {
    twiml.message("🕒 Nuestro horario es de lunes a viernes de 9am a 6pm, y sábados de 9am a 1pm.");
  } else if (msg.includes("info")) {
    twiml.message("ℹ️ Somos una academia de cursos online. Te ayudamos a aprender programación desde cero 🚀.");
  } else {
    twiml.message(`Recibí: "${req.body.Body}" ✅ (escribe *hola*, *horario* o *info*)`);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Ruta de prueba para el navegador
app.get('/', (req, res) => res.send('Bot de WhatsApp activo 🚀 (Día 3 listo)'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en ${port}`));
