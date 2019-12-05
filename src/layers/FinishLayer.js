class FinishLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.fondo = new Fondo(imagenes.menuFinal_fondo, resolution.width * 0.5, resolution.height * 0.5);
        this.texto = new TextoMenu("¡Felicidades! Has completado el juego.", resolution.width * 0.5, resolution.height * 0.7);
        this.fondo2 = new Fondo(imagenes.fondo_2, resolution.width * 0.5, resolution.height * 0.5);
    }

    dibujar() {
        this.fondo2.dibujar();
        this.fondo.dibujar();
        this.texto.dibujar();
    }

    procesarControles() {
        // siguiente pantalla
        if (controles.continuar) {
            layer = new MenuLayer();
            controles.continuar = false;
            nivelActual = 0
        }
    }

}