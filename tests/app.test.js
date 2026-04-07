import { calcularPromedio, obtenerEstado } from '../app.js';

test('Calculo correcto en escala 100', () => {
    expect(calcularPromedio(100, 100, 100, 100)).toBe(100);
    expect(calcularPromedio(40, 40, 40, 40)).toBe(40);
});

test('Estado sin exigencia', () => {
    const estado = obtenerEstado(30, false);
    expect(estado).toContain("Sin validacion");
});

test('Estado con exigencia - Aprobado', () => {
    const estado = obtenerEstado(60, true, 60);
    expect(estado).toContain("APROBADO");
});