const axios = require('axios');
require('dotenv').config({ path: '.env.token' });

/**
 * Consulta datos completos de una persona por DNI usando la API de consultasperu.com
 * @param {string} dni - DNI a consultar
 * @returns {Promise<{nombre: string, apellido_paterno: string, apellido_materno: string, fecha_nacimiento: string}|null>}
*/

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
    if (response.status === 200 && response.data.success) {
      const apiData = response.data.data || {};
      const nombre_completo = (apiData.full_name || '').split(' ');
      const nombre = nombre_completo[0] ? nombre_completo[0].charAt(0).toUpperCase() + nombre_completo[0].slice(1) : '';
      const apellidos = (apiData.surname || '').split(' ');
      const apellido_paterno = apellidos[0] ? apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1) : '';
      const apellido_materno = apellidos[1] ? apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1) : '';
      const fecha_nacimiento = apiData.date_of_birth || '';
      return { nombre, apellido_paterno, apellido_materno, fecha_nacimiento };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

module.exports = generarDatosCompletos;