const { google } = require('googleapis');

// Autenticación con credenciales desde variable de entorno
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ID de tu Google Sheet (lo copias de la URL de la hoja)
const SPREADSHEET_ID = 'TU_ID_DE_HOJA';

// Función para guardar datos
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

// PRUEBA MANUAL
guardarEnSheet('Marlon', 'Hola, este es un test');
