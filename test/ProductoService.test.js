const { ProductoService } = require('../servicio/ProductoService');
const { Producto } = require('../modelo/Producto');

jest.mock('../util/FileManager', () => {
    return jest.fn().mockImplementation(() => ({
        cargarProductos: jest.fn(() => []),
        guardarProductos: jest.fn()
    }));
});

describe('ProductoService', () => {
    let servicio;
    let producto;

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    
    beforeEach(() => {
        servicio = new ProductoService();
        producto = new Producto(1, 'Leche', 'Entera', 1.99, 20);
    });

    test('crear debe agregar un producto válido', () => {
        const resultado = servicio.crear(producto);
        expect(resultado).toBe(true);
    });

    test('crear debe rechazar un producto con ID duplicado', () => {
        servicio.fileManager.cargarProductos.mockReturnValue([producto]);
        const resultado = servicio.crear(producto);
        expect(resultado).toBe(false);
    });

    test('crear debe rechazar producto inválido', () => {
        const invalido = new Producto(0, '', '', -5, -2);
        const resultado = servicio.crear(invalido);
        expect(resultado).toBe(false);
    });

    test('buscarPorId debe devolver el producto si existe', () => {
        servicio.fileManager.cargarProductos.mockReturnValue([producto]);
        const encontrado = servicio.buscarPorId(1);
        expect(encontrado).toEqual(producto);
    });

    test('buscarPorId debe devolver null si no existe', () => {
        servicio.fileManager.cargarProductos.mockReturnValue([]);
        const encontrado = servicio.buscarPorId(99);
        expect(encontrado).toBeNull();
    });
});
