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
    // Función para capitalizar nombres y apellidos
    function capitalizar(texto) {
      if (!texto) return null;
      // Capitaliza cada palabra separada por espacio
      return texto
        .toLowerCase()
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }

    const nombre = apiData.name ? capitalizar(apiData.name) : null;
    let apellido_paterno = null;
    let apellido_materno = null;
    if (apiData.surname) {
      const apellidos = apiData.surname.split(' ');
      apellido_paterno = apellidos[0] ? capitalizar(apellidos[0]) : null;
      apellido_materno = apellidos[1] ? capitalizar(apellidos[1]) : null;
    }
    return {
      nombre,
      apellido_paterno,
      apellido_materno,
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