import { calcularPromedio } from '../app.js';

test('Calcula promedio ponderado correctamente', () => {
    // (4.0*0.1) + (5.0*0.2) + (6.0*0.3) + (7.0*0.4) = 6.0
    expect(calcularPromedio(4, 5, 6, 7)).toBe(6);
});

test('Lanza error si falta una nota', () => {
    expect(() => calcularPromedio(7, 7, 7)).toThrow();
});
