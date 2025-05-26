class Producto {
    constructor(id = 0, nombre = '', descripcion = '', precio = 0.0, cantidad = 0) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    toString() {
        return `ID: ${this.id} | ${this.nombre} | $${this.precio.toFixed(2)} | Stock: ${this.cantidad} | ${this.descripcion}`;
    }

    // Validación básica
    esValido() {
        return this.id > 0 && 
               this.nombre && this.nombre.trim().length > 0 && 
               this.precio >= 0 && 
               this.cantidad >= 0;
    }
}

module.exports = { Producto };