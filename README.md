# 🚀 NodeApp - Servidor Proxy CORS para EPM

## 📋 Descripción

Servidor proxy intermedio desarrollado con Node.js y Express que actúa como intermediario entre aplicaciones frontend y servicios backend corporativos de EPM (Empresas Públicas de Medellín). Este proyecto facilita el desarrollo local, pruebas de integración y testing de carga, solucionando problemas de CORS y proporcionando endpoints simulados (mocks) para desarrollo desacoplado.

## 🎯 Propósito Principal

- **Resolver problemas de CORS** durante el desarrollo de aplicaciones frontend
- **Facilitar el desarrollo** con datos simulados sin dependencia del backend real
- **Realizar pruebas de carga** y estrés sobre APIs de radicación de casos
- **Intermediar** entre aplicaciones locales y servicios corporativos en UAT

## ✨ Características Principales

### 1. 🔄 Servidor Proxy CORS
- Redirige automáticamente peticiones desde aplicaciones frontend (localhost:4200) hacia servidores de EPM
- Maneja todas las configuraciones CORS necesarias
- Preserva headers, parámetros y body de las peticiones originales
- Soporta múltiples métodos HTTP: GET, POST, PUT, PATCH, OPTIONS

### 2. 🎭 Endpoints Mock (Simulados)
- **`GET /api/DescargarTodoComoZip`**: Simula descarga de archivos ZIP sin necesidad del backend real
- Retorna datos de prueba con archivos simulados en base64
- Ideal para desarrollo frontend sin dependencias externas

### 3. 🔬 Testing de Carga
- **`POST /api/test-multiple-calls`**: Ejecuta múltiples llamadas simultáneas a APIs
- Permite especificar número de iteraciones
- Ejecuta peticiones en paralelo usando Promise.allSettled()
- Retorna estadísticas de éxito/error de cada intento

### 4. 🔌 Proxy General
- **`/api/*`**: Redirige cualquier petición hacia el servidor de EPM
- Convierte rutas `/api/*` a `/AdministradorCargaArchivos/*` en el servidor destino
- Maneja respuestas binarias (archivos) y JSON automáticamente

## 🛠️ Stack Tecnológico

- **Node.js** - Runtime de JavaScript
- **Express.js** v4.21.2 - Framework web
- **Axios** v1.8.2 - Cliente HTTP para peticiones
- **CORS** v2.8.5 - Middleware para manejo de políticas CORS
- **HTTPS** v1.0.0 - Manejo de certificados SSL
- **Nodemon** v3.1.9 - Auto-recarga durante desarrollo

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
```bash
cd c:\Repos\nodeApp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor**
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 🚀 Uso

### Configuración del Frontend

Para utilizar este proxy desde tu aplicación Angular u otro frontend, configura tus peticiones hacia:

```typescript
const BASE_URL = 'http://localhost:3000/api';
```

### Endpoints Disponibles

#### 1. 📥 Descargar Archivos ZIP (Mock)

**Endpoint:** `GET /api/DescargarTodoComoZip`

**Descripción:** Simula la descarga de archivos adjuntos como ZIP

**Ejemplo desde Angular:**
```typescript
// Método usando GET
return this.http.get<IObtenerAdjuntosRespuesta>(
  'http://localhost:3000/api/DescargarTodoComoZip', {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    params: {
      idRegistro: '499febac-cf3f-46d1-995e-6ac7cf04f7e4',
      token: 'DU38E8Nl3Yj4iXJwpFmaSKr-KtweoJiP',
      contactid: 'bfab9676-ac6f-4aa7-8ae5-3cff8a4747b1',
      tipoTransaccion: '919900011',
      idTransaccionServicio: 'c988cfc1-661f-ee11-937d-6045bdd51bc4',
      idRequisito: '',
      ruta: '499febac-cf3f-46d1-995e-6ac7cf04f7e4'
    }
  }
);
```

**Respuesta Mock:**
```json
{
  "tieneAnexos": true,
  "archivos": [
    "documento1.pdf",
    "documento2.jpg",
    "documento3.docx"
  ],
  "zipBase64": "Q29udGVuaWRvIGRlIHBydWViYSBkZWwgYXJjaGl2byBaSVA="
}
```

#### 2. 🔬 Pruebas de Carga Múltiples

**Endpoint:** `POST /api/test-multiple-calls`

**Descripción:** Ejecuta múltiples llamadas simultáneas para pruebas de carga y estrés

**Parámetros del Body:**
- `iterations` (number): Número de llamadas simultáneas a realizar
- `payload` (object): Objeto con los datos a enviar en cada petición

**Ejemplo con cURL:**
```bash
curl --location 'http://localhost:3000/api/test-multiple-calls' \
--header 'Ocp-Apim-Subscription-Key: 18bed76a1ee9444392324163447283e5' \
--header 'Content-Type: application/json' \
--data-raw '{
    "iterations": 4,
    "payload": {
        "datosUsuarios": [
            {
                "tipoDocumento": "Pasaporte",
                "numeroDocumento": "uy6777",
                "nombre": "pepe",
                "apellido": "flores",
                "email": "ayalajg@globalhitss.com",
                "contrato": "2132265",
                "telefonoContacto": "3204125098",
                "direccionInmueble": "CR 72 B CL 78 B -85 (INTERIOR 1232 )",
                "servicio": "Energía;Gas;Acueducto;Alcantarillado",
                "tipoRequerimiento": "Reclamo",
                "causa": "5",
                "descripcion": "Energía - prueba v9 test",
                "mesReclamado": "Julio",
                "año": "2025",
                "tipoCaso": 3,
                "idTipoCaso": "831b65a-cb26-41a4-b14e-bddfec100b8a"
            }
        ],
        "isAnexo": false
    }
}'
```

**Respuesta:**
```json
{
  "totalIntentos": 4,
  "respuestas": [
    {
      "intento": 1,
      "status": 200,
      "data": { ... }
    },
    {
      "intento": 2,
      "status": 200,
      "data": { ... }
    },
    {
      "intento": 3,
      "status": "error",
      "error": "Timeout..."
    },
    {
      "intento": 4,
      "status": 200,
      "data": { ... }
    }
  ]
}
```

#### 3. 🔌 Proxy General

**Endpoint:** `/api/*` (cualquier ruta)

**Descripción:** Redirige automáticamente cualquier petición hacia el servidor de EPM

**Servidor Destino:** `https://az-wapp-epm-np-adjuntardocumentos-uat.np-ase01.epm.com.co`

**Transformación de Rutas:**
- `/api/ObtenerDocumentos` → `/AdministradorCargaArchivos/ObtenerDocumentos`
- `/api/SubirArchivo` → `/AdministradorCargaArchivos/SubirArchivo`

**Ejemplo:**
```bash
# Esta petición local...
GET http://localhost:3000/api/ObtenerDocumentos?id=123

# Se redirige automáticamente a...
GET https://az-wapp-epm-np-adjuntardocumentos-uat.np-ase01.epm.com.co/AdministradorCargaArchivos/ObtenerDocumentos?id=123
```

#### 4. 🏠 Ruta de Prueba

**Endpoint:** `GET /`

**Descripción:** Verifica que el servidor está corriendo correctamente

**Respuesta:** `¡Hola, mundito`

## 🔧 Configuración

### Puerto del Servidor
```javascript
const PORT = 3000;
```

### Configuración CORS
```javascript
app.use(cors({
    origin: 'http://localhost:4200',  // URL del frontend
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));
```

### Certificados SSL
⚠️ **IMPORTANTE:** El servidor desactiva la verificación de certificados SSL para desarrollo:
```javascript
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});
```

**Nota:** Esto NO debe usarse en producción. Solo es apropiado para entornos de desarrollo y UAT.

### URL del Servidor de Pruebas
Para el endpoint de pruebas múltiples, la URL configurada es:
```javascript
const endpointUrl = 'https://localhost:7049/RadicacionMercurio/RadicarCaso';
```

### API Key
El proyecto incluye una clave de suscripción de API de prueba:
```javascript
"Ocp-Apim-Subscription-Key": "18bed76a1ee9444392324163447283e5"
```

## 📁 Estructura del Proyecto

```
nodeApp/
│
├── server.js                              # Archivo principal del servidor
├── package.json                           # Configuración y dependencias
├── package-lock.json                      # Lock de dependencias
├── Curl.txt                              # Ejemplos de peticiones cURL
├── ejemplo consumo mock desde front.txt  # Ejemplos de código Angular
├── node_modules/                         # Dependencias instaladas
└── README.md                             # Este archivo
```

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Verifica que no haya otro proceso en el puerto 3000
netstat -ano | findstr :3000

# Si hay un proceso, ciérralo o cambia el puerto en server.js
```

### Error de CORS en el frontend
- Verifica que el origin en la configuración CORS coincida con la URL de tu frontend
- Asegúrate de que el servidor proxy esté corriendo antes de iniciar el frontend

### Errores de certificado SSL
- Los errores SSL son esperados en desarrollo (rejectUnauthorized: false)
- Si necesitas verificación SSL, cambia la configuración del httpsAgent

### Timeout en pruebas de carga
- Las pruebas de carga múltiples pueden tardar dependiendo del servidor destino
- Ajusta el número de iteraciones según la capacidad del servidor

## 🔐 Seguridad

⚠️ **Advertencias de Seguridad:**

1. **Certificados SSL:** La verificación está desactivada. No usar en producción.
2. **API Keys:** Las claves en el código son de prueba. Usar variables de entorno en producción.
3. **CORS Abierto:** Configurado específicamente para localhost:4200. Ajustar según necesidades.
4. **Credenciales:** No commitear credenciales reales al repositorio.

## 🚀 Despliegue

Para ambiente de producción:

1. Activar verificación SSL:
```javascript
const httpsAgent = new https.Agent({
    rejectUnauthorized: true
});
```

2. Usar variables de entorno:
```javascript
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const TARGET_URL = process.env.TARGET_URL;
```

3. Configurar CORS apropiadamente:
```javascript
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
}));
```

4. Agregar autenticación y autorización según sea necesario

## 📝 Scripts Disponibles

```bash
# Iniciar servidor con auto-recarga
npm start

# Ejecutar pruebas (no configuradas aún)
npm test
```

## 🤝 Contribuir

Este es un proyecto interno de EPM para facilitar el desarrollo. Para contribuir:

1. Documenta cualquier cambio en este README
2. Mantén la compatibilidad con los endpoints existentes
3. Prueba localmente antes de compartir cambios
4. Actualiza los ejemplos de uso si añades nuevas funcionalidades

## 📄 Licencia

ISC

## 🔄 Changelog

### Versión 1.0.0
- ✅ Servidor proxy CORS básico
- ✅ Endpoint mock para DescargarTodoComoZip
- ✅ Endpoint de pruebas de carga múltiples
- ✅ Redirección automática de peticiones /api/* a servidor EPM
- ✅ Manejo de certificados SSL para desarrollo
- ✅ Soporte para múltiples métodos HTTP

## 🎯 Roadmap Futuro

- [ ] Agregar autenticación JWT
- [ ] Implementar logging avanzado
- [ ] Agregar más endpoints mock
- [ ] Crear tests unitarios y de integración
- [ ] Agregar documentación Swagger/OpenAPI
- [ ] Implementar rate limiting
- [ ] Agregar métricas y monitoreo

---


