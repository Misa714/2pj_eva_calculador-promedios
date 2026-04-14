import { calcularPromedio, obtenerEstado } from '../app.js';

test('Calculo correcto en escala 100', () => {
    expect(calcularPromedio(100, 100, 100, 100)).toBe(100);
    expect(calcularPromedio(51, 51, 51, 51)).toBe(40);
});

test('Estado sin exigencia', () => {
    const estado = obtenerEstado(30, false);
    expect(estado).toContain("Sin validacion");
});

test('Estado con exigencia - Aprobado', () => {
    const estado = obtenerEstado(51, true, 60);
    expect(estado).toContain("APROBADO");
});

test('Estado con exigencia - Reprobado', () => {
    const estado = obtenerEstado(25, true, 60);
    expect(estado).toContain("REPROBADO");
});

;