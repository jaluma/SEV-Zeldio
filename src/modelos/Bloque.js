class Bloque extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)
    }

    actualizar() {
        
    }

    isDestruible() {
        return false;
    }

    isSaltable() {
        return false;
    }

}