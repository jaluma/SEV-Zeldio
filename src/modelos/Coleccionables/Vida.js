class Vida extends Coleccionable {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)

        //this.animacion = new Animacion(imagenes.vida, this.ancho, this.alto, 1.5, 13);

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
        jugador.vidas += 1;
    }

}