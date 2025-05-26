const Producto = require('../modelo/Producto');
const { ProductoService } = require('../servicio/ProductoService');

describe('ProductoService', () => {
  let service;
  let producto1;
  let producto2;

  beforeEach(() => {
    service = new ProductoService();
    producto1 = new Producto(1, 'Laptop', 'Laptop básica', 1500.0, 5);
    producto2 = new Producto(2, 'Perro', 'Perro grande', 25.0, 10);
  });

  test('crear producto exitoso', () => {
    expect(service.crear(producto1)).toBe(true);
    const encontrado = service.buscarPorId(1);
    expect(encontrado).not.toBeNull();
    expect(encontrado.nombre).toBe('Laptop');
  });

  test('crear producto con ID duplicado', () => {
    service.crear(producto1);
    const duplicado = new Producto(1, 'Otro', 'Otro producto', 100, 1);
    expect(service.crear(duplicado)).toBe(false);
  });

  test('leer todos los productos', () => {
    service.crear(producto1);
    service.crear(producto2);
    expect(service.leerTodos().length).toBe(2);
  });

  test('actualizar producto', () => {
    service.crear(producto1);
    const actualizado = new Producto(1, 'Laptop Pro', 'Gaming', 2000, 3);
    expect(service.actualizar(1, actualizado)).toBe(true);
    const p = service.buscarPorId(1);
    expect(p.nombre).toBe('Laptop Pro');
  });

  test('eliminar producto', () => {
    service.crear(producto1);
    expect(service.eliminar(1)).toBe(true);
    expect(service.buscarPorId(1)).toBeNull();
  });

  test('crear producto con precio negativo lanza error', () => {
    const malo = new Producto(3, 'Malo', 'Desc', -100, 1);
    expect(() => service.crear(malo)).toThrow('Precio no puede ser negativo');
  });
});
