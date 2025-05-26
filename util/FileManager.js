const fs = require('fs');
const path = require('path');

class FileManager {
    constructor() {
        this.archivoRuta = path.join('data', 'productos.json');
        this.crearArchivoSiNoExiste();
    }

    crearArchivoSiNoExiste() {
        const directorio = path.dirname(this.archivoRuta);
        
        // Crear directorio si no existe
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        // Crear archivo si no existe
        if (!fs.existsSync(this.archivoRuta)) {
            this.guardarProductos([]);
        }
    }

    cargarProductos() {
        try {
            if (!fs.existsSync(this.archivoRuta)) {
                return [];
            }

            const data = fs.readFileSync(this.archivoRuta, 'utf8');
            if (!data.trim()) {
                return [];
            }

            const productosData = JSON.parse(data);
            // Convertir objetos planos a instancias de Producto
            return productosData.map(p => new Producto(p.id, p.nombre, p.descripcion, p.precio, p.cantidad));
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
            return [];
        }
    }

    guardarProductos(productos) {
        try {
            // Convertir instancias de Producto a objetos planos para JSON
            const productosData = productos.map(p => ({
                id: p.id,
                nombre: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                cantidad: p.cantidad
            }));

            fs.writeFileSync(this.archivoRuta, JSON.stringify(productosData, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
            throw error;
        }
    }
}
