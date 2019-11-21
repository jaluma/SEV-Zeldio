class Trampilla extends Puerta {

    constructor(imagen, x, y, recuperarLayer = false, activarConBoton = true) {
        super(imagen, x, y, recuperarLayer, activarConBoton)

        this.animacion = this.aPuerta
        this.activarConBoton = activarConBoton
        this.rango = 2

        this.recuperarLayer = recuperarLayer
    }

    interactuar() {
        if (layer.jugador.inventario.length != 0) {
            for (var i in layer.jugador.inventario) {
                var inv = layer.jugador.inventario[i]
                if (inv instanceof Llave) {
                    super.interactuar()
                    break;
                }
            }
        } else
            layer.texto = new TextoBocadillo("¡No tienes la llave!")
    }
}