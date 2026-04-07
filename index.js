import { calcularPromedio, obtenerEstado } from './app.js';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pregunta = (txt) => new Promise((res) => rl.question(txt, res));

async function menu() {
    let continuar = true;

    while (continuar) {
        console.log("\n--- CALCULADORA DE NOTAS (ESCALA 1-100) ---");
        try {
            const n1 = parseFloat(await pregunta("Nota 1 (10%): "));
            const n2 = parseFloat(await pregunta("Nota 2 (20%): "));
            const n3 = parseFloat(await pregunta("Nota 3 (30%): "));
            const n4 = parseFloat(await pregunta("Nota 4 (40%): "));

            const inputExigencia = await pregunta("¿Deseas aplicar exigencia? (s/n): ");
            const quiereExigencia = inputExigencia.toLowerCase() === 's';

            let nivel = 60;
            if (quiereExigencia) {
                const inputNivel = await pregunta("Nivel de exigencia % (por defecto 60): ");
                nivel = parseFloat(inputNivel || 60);
            }

            const promedio = calcularPromedio(n1, n2, n3, n4);
            const estado = obtenerEstado(promedio, quiereExigencia, nivel);

            console.log("\n-------------------------------------");
            console.log("Promedio Final: " + promedio + " / 100");
            console.log("Resultado: " + estado);
            console.log("-------------------------------------");

        } catch (e) {
            console.log("\nError: " + e.message);
        }

        const r = await pregunta("\n¿Calcular de nuevo? (s/n): ");
        if (r.toLowerCase() !== 's') continuar = false;
    }

    console.log("Cerrando calculadora.");
    rl.close();
}

menu();