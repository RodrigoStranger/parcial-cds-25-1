const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function generarDatosCompletos(dni) {
  const url = 'https://api.consultasperu.com/api/v1/query';
  const headers = { 'Content-Type': 'application/json' };
  const data = {
    token: process.env.TOKEN_API,
    type_document: 'dni',
    document_number: dni
  };

  try {
    const response = await axios.post(url, data, { headers });
    const apiData = response.data && response.data.data ? response.data.data : {};
    return {
      nombre: apiData.name || null,
      apellido_paterno: apiData.surname ? apiData.surname.split(' ')[0] || null : null,
      apellido_materno: apiData.surname ? apiData.surname.split(' ')[1] || null : null,
      fecha_nacimiento: apiData.date_of_birth || null,
      apiData
    };
  } catch (error) {
    return {
      error: error.message,
      detalle: error.response && error.response.data ? error.response.data : null
    };
  }
}

module.exports = generarDatosCompletos;