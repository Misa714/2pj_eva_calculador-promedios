export function calcularPromedio(n1, n2, n3, n4) {
    const notas = [n1, n2, n3, n4];
    if (notas.some(n => isNaN(n) || n < 1 || n > 100)) {
        throw new Error("Las notas deben estar entre 1 y 100");
    }
    const resultado = (n1 * 0.1) + (n2 * 0.2) + (n3 * 0.3) + (n4 * 0.4);
    return Math.round(resultado);
}

export function obtenerEstado(promedio, aplicarExigencia, nivelExigencia = 60) {
    if (!aplicarExigencia) {
        return "Promedio calculado (Sin validacion de aprobacion)";
    }

    const notaAprobacion = 40;

    if (promedio >= notaAprobacion) {
        return "APROBADO (Exigencia aplicada: " + nivelExigencia + "%)";
    } else {
        return "REPROBADO (Exigencia aplicada: " + nivelExigencia + "%)";
    }
}