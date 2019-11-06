class Placa extends BaseInteractuable {

    constructor(x, y, objeto = null) {
        super(imagenes.placa, x, y, objeto)

        this.aPlaca = new Animacion(imagenes.placa, this.ancho, this.alto, 1, 1, true);
        this.aActivada = new Animacion(imagenes.placa_activada, this.ancho, this.alto, 1, 1, true);

        this.animacion = this.aPlaca

        this.activado = false
        this.activarConBoton = false
        this.rango = 10

        this.delay = 2 * 1000
        this.ultimaVezActivada = Date.now()
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    activar() {
        this.activado = true
        this.animacion = this.aActivada
    }

    desactivar() {
        this.activado = false
        this.animacion = this.aPlaca
    }

    interactuar() {
        var now = Date.now()
        if (this.ultimaVezActivada + this.delay <= now && !this.activado) {
            if (gameLayer.orden == this.orden) {
                gameLayer.orden++;
                this.activar()
                this.objeto = "Placa " + gameLayer.orden + " activada."
                this.ultimaVezActivada = now
            } else {
                gameLayer.orden = 0
                this.desactivar()
                this.objeto = null
                for (var i = 0; i < gameLayer.interactuables.length; i++) {
                    gameLayer.interactuables[i].desactivar()
                }
            }
        }

        return this.getObjeto()
    }

    getObjeto() {
        return this.objeto !== null ? this.objeto : "Ohhhh mala suerte..."
    }

}