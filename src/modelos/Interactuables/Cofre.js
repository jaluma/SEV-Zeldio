class Cofre extends BaseInteractuable {

    constructor(x, y, objeto = null) {
        super(imagenes.cofre, x, y, objeto)

        this.aCofre = new Animacion(imagenes.cofre, this.ancho, this.alto, 1, 1, true);
        this.aAbrirCofre = new Animacion(imagenes.cofre_anim, this.ancho, this.alto, 5, 4, false);

        this.animacion = this.aCofre

        this.abierto = false
    }

    actualizar() {
        this.animacion.actualizar();
    }

    abrir() {
        this.animacion = this.aAbrirCofre
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    interactuar() {
        this.abrir()
        if (!this.abierto) {
            this.abierto = !this.abierto
            if (this.objeto == null) {
                nivelActual--
                layer = estadosLayers[nivelActual]
                layer.jugador.x = layer.spawnX
                layer.jugador.y = layer.spawnY
            }

            return this.getObjeto()
        }
        return null
    }
}