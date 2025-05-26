const { Producto } = require('../modelo/Producto');

describe('Producto', () => {
    test('toString devuelve la representación esperada', () => {
        const p = new Producto(1, 'Manzana', 'Fruta roja', 2.5, 10);
        expect(p.toString()).toContain('Manzana');
        expect(p.toString()).toContain('Stock: 10');
    });

    test('esValido debe validar correctamente productos válidos', () => {
        const p = new Producto(1, 'Pan', 'Integral', 1.5, 5);
        expect(p.esValido()).toBe(true);
    });

    test('esValido debe detectar un producto inválido', () => {
        const p = new Producto(0, '', '', -1, -10);
        expect(p.esValido()).toBe(false);
    });
});
