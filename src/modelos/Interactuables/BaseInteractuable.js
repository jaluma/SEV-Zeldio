class BaseInteractuable extends Modelo {

    constructor(imagen, x, y, objeto = null) {
        super(imagen, x, y)

        this.objeto = objeto
        this.activarConBoton = true
    }

    interactuar() {

    }

    actualizar() {

    }

    getObjeto() {
        return this.objeto !== null ? this.objeto : "Ohhhh mala suerte..."
    }
}