class Moneda extends Coleccionable {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)

        this.animacion = new Animacion(imagenes.monedas, this.ancho, this.alto, 1.5, 13);

        this.valor = 10;
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    colision(jugador) {
        jugador.monedas += this.valor
    }

}