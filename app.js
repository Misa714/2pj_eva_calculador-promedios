export function calcularPromedio(n1, n2, n3, n4) {
    const notas = [n1, n2, n3, n4];

    if (notas.some(n => n === undefined || n === null || isNaN(n))) {
        throw new Error("Todas las notas son requeridas");
    }

    // Ponderación: 10%, 20%, 30%, 40%
    const resultado = (n1 * 0.1) + (n2 * 0.2) + (n3 * 0.3) + (n4 * 0.4);
    return Math.round(resultado * 10) / 10;
}