const express = require("express");
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const { log } = require("console");
const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
  }));

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false // IMPORTANTE: Esto desactiva la verificación de certificados SSL
  });

app.use(express.json()); // Middleware para leer JSON en las peticiones

// Ruta simulada para DescargarTodoComoZip SIN llamar al endpoint real -- MOCK
app.get('/api/DescargarTodoComoZip', (req, res) => {
  try {
    console.log('Simulando respuesta local para DescargarTodoComoZip');

    // Datos simulados
    const mockResponse = {
      tieneAnexos: true,
      archivos: [
        'documento1.pdf',
        'documento2.jpg',
        'documento3.docx'
      ],
      zipBase64: Buffer.from('Contenido de prueba del archivo ZIP').toString('base64')
    };

    //  encabezados
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="documentos.zip"'
    });

    // Responder el mock 
    res.json(mockResponse);

  } catch (error) {
    console.error('Error al simular la respuesta:', error.message);
    res.status(500).send({
      message: 'Error interno en la simulación',
      error: error.message
    });
  }
});

// Ruta para probar múltiples lalmados
app.post('/api/test-multiple-calls', async (req, res) => {
  const { iterations = 1, payload } = req.body;

  if (!payload) {
    return res.status(400).json({ message: "Se requiere el campo 'payload' con los datos para enviar." });
  }

  // const endpointUrl = 'https://localhost:7049/RadicacionMercurio/RadicarCaso';
  const endpointUrl = 'https://localhost:7049/RadicacionMercurio/RadicarCaso';

  console.log(`Realizando ${iterations} intentos a: ${endpointUrl}`);
  try {
    const promises = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`Realizando intento ${i + 1}...`);
      promises.push(
        axios.post(endpointUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            "Ocp-Apim-Subscription-Key": "18bed76a1ee9444392324163447283e5"
          },
          httpsAgent: httpsAgent
        })
      );
    }

    const responses = await Promise.allSettled(promises);

    // Formateamos resultado
    const formatted = responses.map((result, idx) => {
      if (result.status === 'fulfilled') {
        return { intento: idx + 1, status: result.value.status, data: result.value.data };
      } else {
        return { intento: idx + 1, status: 'error', error: result.reason.message };
      }
    });

    res.json({
      totalIntentos: iterations,
      respuestas: formatted
    });

  } catch (error) {
    console.error("Error en ejecución múltiple:", error.message);
    res.status(500).json({ message: "Error al ejecutar las múltiples peticiones", error: error.message });
  }
});

// Ruta general para manejar otras peticiones
app.all('/api/*', async (req, res) => {
    try {
      // Obtener la ruta desde la URL original
      const path = req.path.replace('/api', '/AdministradorCargaArchivos');
      
      // Construir la URL completa
      const targetUrl = `https://az-wapp-epm-np-adjuntardocumentos-uat.np-ase01.epm.com.co${path}`;
      
      // Configurar la petición
      const config = {
        method: req.method,
        url: targetUrl,
        params: req.query,
        headers: {
          ...req.headers,
          host: 'az-wapp-epm-np-adjuntardocumentos-uat.np-ase01.epm.com.co'
        },
        httpsAgent: httpsAgent
      };
      
      // Añadir el cuerpo de la petición si es POST, PUT, etc.
      if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
        config.data = req.body;
      }
      
      // Configurar la respuesta como arraybuffer si es necesario
      if (req.headers.accept && req.headers.accept.includes('application/octet-stream')) {
        config.responseType = 'arraybuffer';
      }
      
      console.log(`Redirigiendo ${req.method} a: ${targetUrl}`);
      
      // Realizar la petición al servidor remoto
      const response = await axios(config);
      
      // Copiar los encabezados de la respuesta
      Object.entries(response.headers).forEach(([key, value]) => {
        // Excluir encabezados específicos que podrían causar problemas
        if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
          res.set(key, value);
        }
      });
      
      // Enviar la respuesta al cliente
      res.status(response.status).send(response.data);
    } catch (error) {
      console.log(" todo el error", stringify(error ,null, 2));
      console.error('Error al procesar la petición:', error.message);
      
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send({
          message: 'Error interno del servidor',
          error: error.message
        });
      }
    }
  });

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Hola, mundito");
});

// Iniciar el servidor

app.listen(PORT, () => {
    console.log(`Servidor proxy CORS ejecutándose en http://localhost:${PORT}`);
    console.log('Redirigiendo peticiones a: https://az-wapp-epm-np-adjuntardocumentos-uat.np-ase01.epm.com.co');
  });