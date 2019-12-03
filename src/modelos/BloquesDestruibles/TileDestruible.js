class TileDestruible extends BloqueDestruible {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)
        this.destruible = 1
    }

    isSaltable() {
        return true
    }
}