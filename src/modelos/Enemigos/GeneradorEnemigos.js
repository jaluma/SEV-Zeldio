class GeneradorEnemigos extends Modelo {

    constructor(rutaImagen, x, y, limit = 5) {
        super(rutaImagen, x, y)

        this.animacion = new Animacion(imagenes.teleport_azul_a, this.ancho, this.alto, 6, 3);

        this.limit = limit

        this.delayInt = 200
        this.delay = this.delayInt * 0.2;

        this.typesEnemigos = []
        this.typesEnemigos.push(new RickEnemigo(this.x, this.y))
    }

    actualizar() {
        this.animacion.actualizar();

        if (layer.enemigos.length < this.limit) {
            // generar nuevos enemigos en el layer
            if (this.delay <= 0) {
                // Generador de enemigos
                var enemigo = this.getEnemigo()
                enemigo.y = enemigo.y - enemigo.alto / 2;
                // modificación para empezar a contar desde el suelo
                layer.enemigos.push(enemigo);
                layer.espacio.agregarCuerpoDinamico(enemigo);

                this.delay = this.delayInt
            }
            this.delay--
        }
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    getEnemigo() {
        var random = Math.floor(Math.random() * this.typesEnemigos.length)
        var enemigo = this.typesEnemigos[random]
        enemigo.x = this.x + this.ancho * 1
        return this.clone(enemigo)
    }

}