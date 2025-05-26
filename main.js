class Main {
    constructor() {
        this.servicio = new ProductoService();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    mostrarMenu() {
        console.log("\n--- MENÚ CRUD ---");
        console.log("1. Crear producto");
        console.log("2. Listar productos");
        console.log("3. Actualizar producto");
        console.log("4. Eliminar producto");
        console.log("5. Salir\n");
    }

    preguntar() {
        this.mostrarMenu();
        this.rl.question("Elige una opción: ", async (opcion) => {
            switch (opcion) {
                case "1":
                    await this.crearProducto();
                    break;
                case "2":
                    this.listarProductos();
                    break;
                case "3":
                    await this.actualizarProducto();
                    break;
                case "4":
                    await this.eliminarProducto();
                    break;
                case "5":
                    this.rl.close();
                    return;
                default:
                    console.log("Opción inválida.");
            }
            this.preguntar(); // Volver a mostrar el menú
        });
    }

    async crearProducto() {
        const producto = {};
        producto.id = parseInt(await this.preguntarValor("ID:"));
        producto.nombre = await this.preguntarValor("Nombre:");
        producto.descripcion = await this.preguntarValor("Descripción:");
        producto.precio = parseFloat(await this.preguntarValor("Precio:"));
        producto.cantidad = parseInt(await this.preguntarValor("Cantidad:"));
        try {
            this.servicio.crear(producto);
            console.log("Producto creado correctamente.");
        } catch (e) {
            console.log("Error: " + e.message);
        }
    }

    listarProductos() {
        const lista = this.servicio.listar();
        if (lista.length === 0) {
            console.log("No hay productos registrados.");
        } else {
            console.table(lista);
        }
    }

    async actualizarProducto() {
    const id = parseInt(await this.preguntarValor("ID del producto a actualizar:"));
    const campo = await this.preguntarValor("Campo a modificar (nombre, descripcion, precio, cantidad):");

    // Validar que el campo sea uno de los permitidos
    const camposValidos = ["nombre", "descripcion", "precio", "cantidad"];
    if (!camposValidos.includes(campo.toLowerCase())) {
        console.log("Campo inválido. Solo se permite nombre, descripcion, precio o cantidad.");
        return;
    }

    const valor = await this.preguntarValor("Nuevo valor:");

    // Convertir a número si es precio o cantidad
    const valorProcesado = (campo === "precio" || campo === "cantidad") ? Number(valor) : valor;

    const actualizado = this.servicio.actualizar(id, {
        [campo]: valorProcesado
    });

    console.log(actualizado ? "Producto actualizado." : "Producto no encontrado.");
}


    async eliminarProducto() {
        const id = parseInt(await this.preguntarValor("ID del producto a eliminar:"));
        this.servicio.eliminar(id);
        const eliminado = this.servicio.eliminar(id);
        console.log(eliminado ? "Producto eliminado." : "Producto no encontrado.");
    }

    preguntarValor(pregunta) {
        return new Promise(resolve => {
            this.rl.question(pregunta + " ", answer => resolve(answer));
        });
    }

    async main() {
        this.preguntar();
    }
}

// MENÚ PRINCIPAL DEL ARCHIVO
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes("--test")) {
        const tests = new ProductoServiceTest();
        tests.ejecutarTodos();
    } else {
        const app = new Main();
        app.main().catch(console.error);
    }
}
