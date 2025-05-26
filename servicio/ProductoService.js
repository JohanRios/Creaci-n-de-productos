const FileManager = require('../util/FileManager');
const { Producto } = require('../modelo/Producto');

class ProductoService {
    constructor() {
        this.fileManager = new FileManager();
    }

    // Crear producto con validaciones y persistencia
    crear(producto) {
        try {

            // Validar ID numérico
            if (typeof producto.id !== 'number' || isNaN(producto.id)) {
                throw new Error('ID inválido');
            }

            const productos = this.fileManager.cargarProductos();

            // Verificar ID duplicado
            if (productos.find(p => p.id === producto.id)) {
                return false; // Ya existe producto con ese ID
            }

            // Validar método esValido() si existe
            if (typeof producto.esValido === 'function' && !producto.esValido()) {
                throw new Error('Producto no pasó validación');
            }

            productos.push(producto);
            this.fileManager.guardarProductos(productos);
            return true;

        } catch (error) {
            console.error('Error al crear producto:', error.message);
            return false;
        }
    }

    // Leer todos los productos
    leerTodos() {
        try {
            return this.fileManager.cargarProductos();
        } catch (error) {
            console.error('Error al leer productos:', error.message);
            return [];
        }
    }

    // Buscar producto por ID
    buscarPorId(id) {
        try {
            const idNum = typeof id === 'string' ? parseInt(id) : id;
            if (isNaN(idNum)) return null;

            const productos = this.leerTodos();
            return productos.find(p => p.id === idNum) || null;
        } catch (error) {
            console.error('Error al buscar producto por ID:', error.message);
            return null;
        }
    }

    // Actualizar producto con validaciones
    actualizar(id, productoActualizado) {
        try {
            if (typeof productoActualizado !== 'object' || productoActualizado === null) {
                throw new Error('Datos inválidos para actualizar');
            }

            const productos = this.fileManager.cargarProductos();
            const idNum = typeof id === 'string' ? parseInt(id) : id;

            if (isNaN(idNum)) {
                throw new Error('ID inválido');
            }

            const indice = productos.findIndex(p => p.id === idNum);
            if (indice === -1) {
                console.warn(`Producto con ID ${id} no existe.`);
                return false;
            }

            // Asignar ID fijo para evitar que se cambie
            productoActualizado.id = idNum;

            // Validar método esValido() si existe
            if (typeof productoActualizado.esValido === 'function' && !productoActualizado.esValido()) {
                throw new Error('Producto actualizado no válido');
            }

            // Merge con producto existente para mantener campos no modificados
            productos[indice] = { ...productos[indice], ...productoActualizado };
            this.fileManager.guardarProductos(productos);
            return true;

        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            return false;
        }
    }

    // Eliminar producto por ID con validación
    eliminar(id) {
        try {
            const productos = this.fileManager.cargarProductos();
            const idNum = typeof id === 'string' ? parseInt(id) : id;

            if (isNaN(idNum)) {
                throw new Error('ID inválido');
            }

            const nuevosProductos = productos.filter(p => p.id !== idNum);

            if (nuevosProductos.length === productos.length) {
                // No se encontró el producto para eliminar
                return false;
            }

            this.fileManager.guardarProductos(nuevosProductos);
            return true;

        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            return false;
        }
    }

    // Generar un nuevo ID incremental
    generarNuevoId() {
        try {
            const productos = this.leerTodos();
            if (productos.length === 0) return 1;

            const maxId = Math.max(...productos.map(p => (typeof p.id === 'number' ? p.id : 0)));
            return maxId + 1;

        } catch (error) {
            console.error('Error al generar nuevo ID:', error.message);
            return 1;
        }
    }
}

module.exports = { ProductoService };