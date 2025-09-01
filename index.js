const express = require('express');
const { google } = require('googleapis');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(express.urlencoded({ extended: false })); // Twilio manda form-urlencoded

// ===== GOOGLE SHEETS (credenciales desde ENV) =====
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Pega aquí el ID de tu hoja (lo que va entre /d/ y /edit)
const SPREADSHEET_ID = 'TU_SHEET_ID';

// helper para guardar
async function guardarEnSheet(cols = []) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A:C', // Fecha | Tel | Mensaje
    valueInputOption: 'RAW',
    requestBody: { values: [cols] },
  });
}

// ===== RUTAS =====

// salud
app.get('/', (_, res) => res.send('Bot WhatsApp + Sheets listo ✅'));

// test por navegador: /test-sheets?name=Marlon&msg=Hola
app.get('/test-sheets', async (req, res) => {
  try {
    const name = (req.query.name || '').toString();
    const msg  = (req.query.msg  || '').toString();
    await guardarEnSheet([new Date().toISOString(), name, msg]);
    res.send('✅ Guardado: ' + name + ' | ' + msg);
  } catch (e) {
    console.error(e);
    res.status(500).send('❌ Error: ' + (e.message || e));
  }
});

// webhook de Twilio
app.post('/whatsapp', async (req, res) => {
  const twiml = new MessagingResponse();
  const body = (req.body.Body || '').trim();
  const from = (req.body.From || '').replace('whatsapp:', '');

  try {
    await guardarEnSheet([new Date().toISOString(), from, body]);
  } catch (e) {
    console.error('Sheets error:', e.message || e);
  }

  twiml.message(`Recibí: "${body}" y lo guardé en Sheets ✅`);
  res.type('text/xml').send(twiml.toString());
});

// Render usa PORT
const port = process.env.PORT || 10000;
app.listen(port, () => console.log('Escuchando en ' + port));
