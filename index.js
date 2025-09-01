const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { google } = require('googleapis');

// === Configuración Google Sheets ===
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = 'TU_ID_DE_HOJA'; // <-- pega el ID de tu hoja de cálculo

async function guardarEnSheet(nombre, mensaje) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Hoja1!A:B',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[nombre, mensaje]],
    },
  });
  console.log('✅ Datos guardados en Google Sheets');
}

// === Configuración Express ===
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/whatsapp', async (req, res) => {
  const twiml = new MessagingResponse();

  const mensaje = req.body.Body || 'Sin mensaje';
  const numero = req.body.From || 'Desconocido';

  // Guardar en Google Sheets
  try {
    await guardarEnSheet(numero, mensaje);
  } catch (err) {
    console.error('❌ Error guardando en Google Sheets:', err);
  }

  // Respuesta automática (eco)
  twiml.message(`Recibí: "${mensaje}" ✅`);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Bot escuchando en puerto ${PORT}`);
});

