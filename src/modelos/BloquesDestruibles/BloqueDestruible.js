class BloqueDestruible extends Bloque {
    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)

        this.estado = estadosTile.normal;
        this.destruible = 3 * 10
    }

    destruir() {
        if (this.destruible >= 0) {
            this.destruible--;
            this.estado = estadosTile.rompiendo
        } else {
            if (this.estado == estadosTile.rompiendo) {
                this.estado = estadosTile.roto
            }
        }
    }


    isDestruible() {
        return true;
    }

    isDisparable() {
        return false
    }

    isSaltable() {
        return false
    }
}