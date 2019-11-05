class TextoMenu extends Texto {
    constructor(valor, x, y) {
        super(valor, x, y)
    }

    dibujar() {
        var fill = contexto.fillStyle
        contexto.fillStyle = 'rgba(0,0,0,0.5)';
        contexto.fillRect(0, this.y - 50, resolution.width, 2000)
        contexto.fillStyle = fill

        super.dibujar()
    }
}