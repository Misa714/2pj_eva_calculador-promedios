import express from 'express';
// Ajusta la ruta de importación según dónde esté tu función de cálculo
// Ejemplo: si tu módulo principal exporta { calcularPromedio }
// import { calcularPromedio } from './index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get('/', (req, res) => {
    // Aquí puedes llamar a tu función de cálculo con valores de ejemplo
    // const resultado = calcularPromedio([6, 5.5, 7], 60);
    // res.send(`Promedio calculado: ${resultado}`);

    // Por ahora, una respuesta simple para verificar que el servidor funciona
    res.send('✅ Calculadora de promedios funcionando');
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});