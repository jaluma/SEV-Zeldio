class MenuLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.fondo = new Fondo(imagenes.menu_fondo, resolution.width * 0.5, resolution.height * 0.5);
        this.texto = new TextoMenu("Pulse SPACE para empezar...", resolution.width * 0.5, resolution.height * 0.7);
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
            gameLayer = new GameLayer();
            layer = gameLayer;
            controles.continuar = false;
        }
    }

}