class PuntoDeGuardado extends Bloque {

    constructor(x, y) {
        super(imagenes.teleport_naranja, x, y)

        this.aTeleport = new Animacion(imagenes.teleport_naranja_a, this.ancho, this.alto, 6, 3, true);

        this.animacion = this.aTeleport

        this.rango = 10
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
}