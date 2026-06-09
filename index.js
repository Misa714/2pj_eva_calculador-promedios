import express from 'express';
import { MongoClient } from 'mongodb';
import { calcularPromedio, obtenerEstado } from './app.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Página principal con el formulario visual
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora de Notas - DevOps AWS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
      background: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #fff;
    }
    .container {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2rem 2.5rem;
      box-shadow: 0 30px 60px rgba(0,0,0,0.5);
      width: 100%;
      max-width: 550px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    h1 {
      text-align: center;
      margin-bottom: 0.3rem;
      font-weight: 600;
      font-size: 2rem;
      color: #f0f0f0;
    }
    .subtitle {
      text-align: center;
      margin-bottom: 1.8rem;
      font-size: 0.9rem;
      color: #b0b0b0;
    }
    .nota-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
      background: rgba(255,255,255,0.1);
      padding: 0.8rem 1rem;
      border-radius: 12px;
    }
    .nota-row label {
      font-weight: 500;
      width: 40%;
      color: #ddd;
    }
    .nota-row input {
      width: 55%;
      padding: 0.6rem 0.8rem;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      background: rgba(0,0,0,0.3);
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border 0.3s;
    }
    .nota-row input:focus {
      border-color: #4facfe;
    }
    .exigencia-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0 1.8rem;
      background: rgba(255,255,255,0.05);
      padding: 0.8rem 1rem;
      border-radius: 12px;
    }
    .exigencia-group label {
      color: #ccc;
      font-size: 0.95rem;
    }
    .exigencia-group input[type="checkbox"] {
      transform: scale(1.2);
      margin-right: 0.3rem;
    }
    .exigencia-group input[type="number"] {
      width: 70px;
      padding: 0.4rem;
      border: 1px solid rgba(255,255,255,0.3);
      background: rgba(0,0,0,0.4);
      color: #fff;
      border-radius: 6px;
      text-align: center;
    }
    button {
      width: 100%;
      padding: 1rem;
      background: #4facfe;
      border: none;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: bold;
      color: #0f2027;
      cursor: pointer;
      transition: background 0.3s, transform 0.1s;
      letter-spacing: 0.5px;
    }
    button:hover {
      background: #38a3ff;
      transform: translateY(-2px);
    }
    button:active {
      transform: translateY(0);
    }
    .result {
      margin-top: 1.8rem;
      padding: 1.2rem;
      border-radius: 12px;
      text-align: center;
      font-weight: 500;
      display: none;
      backdrop-filter: blur(5px);
    }
    .result.success {
      background: rgba(40, 167, 69, 0.25);
      border: 1px solid rgba(40, 167, 69, 0.5);
      color: #a3f0b5;
    }
    .result.error {
      background: rgba(220, 53, 69, 0.25);
      border: 1px solid rgba(220, 53, 69, 0.5);
      color: #f5a3a3;
    }
    .footer {
      text-align: center;
      margin-top: 1.2rem;
      font-size: 0.8rem;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Calculadora DevOps</h1>
    <p class="subtitle">Sistema de promedio ponderado (10% - 20% - 30% - 40%)</p>
    <form id="calcForm">
      <div class="nota-row">
        <label>Nota 1 (10%)</label>
        <input type="number" id="nota1" step="0.1" min="1" max="100" value="70" required>
      </div>
      <div class="nota-row">
        <label>Nota 2 (20%)</label>
        <input type="number" id="nota2" step="0.1" min="1" max="100" value="65" required>
      </div>
      <div class="nota-row">
        <label>Nota 3 (30%)</label>
        <input type="number" id="nota3" step="0.1" min="1" max="100" value="80" required>
      </div>
      <div class="nota-row">
        <label>Nota 4 (40%)</label>
        <input type="number" id="nota4" step="0.1" min="1" max="100" value="55" required>
      </div>
      <div class="exigencia-group">
        <label>
          <input type="checkbox" id="exigenciaCheck"> Exigencia
        </label>
        <label>Nivel (%)</label>
        <input type="number" id="nivelExigencia" value="60" min="1" max="100" disabled>
      </div>
      <button type="submit">Calcular Promedio</button>
    </form>
    <div id="resultado" class="result"></div>
    <div class="footer">Desplegado en AWS EC2 con Docker & CI/CD</div>
  </div>
  <script>
    const checkExigencia = document.getElementById('exigenciaCheck');
    const nivelInput = document.getElementById('nivelExigencia');
    checkExigencia.addEventListener('change', () => {
      nivelInput.disabled = !checkExigencia.checked;
    });

    const form = document.getElementById('calcForm');
    const resultDiv = document.getElementById('resultado');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const n1 = parseFloat(document.getElementById('nota1').value);
      const n2 = parseFloat(document.getElementById('nota2').value);
      const n3 = parseFloat(document.getElementById('nota3').value);
      const n4 = parseFloat(document.getElementById('nota4').value);
      const quiereExigencia = checkExigencia.checked;
      const nivel = quiereExigencia ? parseFloat(nivelInput.value) || 60 : 60;

      if ([n1,n2,n3,n4].some(v => isNaN(v) || v < 1 || v > 100)) {
        resultDiv.className = 'result error';
        resultDiv.textContent = 'Todas las notas deben estar entre 1 y 100.';
        resultDiv.style.display = 'block';
        return;
      }

      try {
        const resp = await fetch('/calcular', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ n1, n2, n3, n4, quiereExigencia, nivel })
        });
        const data = await resp.json();
        if (resp.ok) {
          resultDiv.className = 'result success';
          resultDiv.innerHTML = '<strong>Promedio:</strong> ' + data.promedio + ' / 100<br><strong>Estado:</strong> ' + data.estado;
        } else {
          resultDiv.className = 'result error';
          resultDiv.textContent = data.error || 'Error en el servidor';
        }
      } catch (err) {
        resultDiv.className = 'result error';
        resultDiv.textContent = 'Error de conexión con el servidor';
      }
      resultDiv.style.display = 'block';
    });
  </script>
</body>
</html>`);
});

// Health check (idéntico al que ya funciona)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        app: 'calculadora-promedios',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
app.get('/db', async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db('calculadora');
        const collections = await db.listCollections().toArray();
        await client.close();
        res.json({
            status: 'conectado a MongoDB',
            base: 'calculadora',
            colecciones: collections.map(c => c.name)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión a MongoDB', detalle: error.message });
    }
});

// Endpoint de cálculo usando tu lógica de app.js
app.post('/calcular', (req, res) => {
    const { n1, n2, n3, n4, quiereExigencia, nivel } = req.body;

    const notas = [n1, n2, n3, n4];
    if (notas.some(n => typeof n !== 'number' || isNaN(n) || n < 1 || n > 100)) {
        return res.status(400).json({ error: 'Las notas deben ser números entre 1 y 100.' });
    }

    try {
        const promedio = calcularPromedio(n1, n2, n3, n4);
        const estado = obtenerEstado(promedio, !!quiereExigencia, nivel || 60);
        res.json({ promedio: Math.round(promedio * 100) / 100, estado });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Arranque del servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor web corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📦 Modo: ${process.env.NODE_ENV || 'development'}`);
});