class Bloque extends Modelo {

    constructor(rutaImagen, x, y, animacion = null) {
        super(rutaImagen, x, y)

        this.animacion = animacion;
    }

    actualizar() {
        if (this.animacion !== null)
            this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        super.dibujar(scrollX, scrollY);
        if (this.animacion !== null) {
                this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
        }
    }

    isDestruible() {
        return false;
    }

    isSaltable() {
        return false;
    }

}