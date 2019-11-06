class Inventario extends Modelo {

    constructor(x, y) {
        super(imagenes.transparente, x, y)
        this.lista = []
    }

    añadir(objeto) {
        var xIzquierda = this.ancho / 2
        objeto.x = parseFloat(this.x + xIzquierda + this.lista.length * 0.03).toFixed(2)
        objeto.y = this.y
        this.lista.push(objeto)
    }

    dibujar() {
        for (var i = 0; i < this.lista.length; i++) {
            this.lista[i].dibujar()
        }
    }

}