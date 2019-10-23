class MenuLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.fondo =
            new Fondo(imagenes.menu_fondo, resolution.width * 0.5, resolution.height * 0.5);
        this.boton =
            new Boton(imagenes.boton_jugar, resolution.width * 0.5, resolution.height * 0.7);

        this.texto = new Texto("Pulsa SPACE para empezar...", resolution.width * 0.5, resolution.height * 0.8);
    }

    dibujar() {
        this.fondo.dibujar();
        this.boton.dibujar();
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