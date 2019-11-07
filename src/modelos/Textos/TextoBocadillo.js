class TextoBocadillo extends Texto {
    constructor(message, x = resolution.width * 0.5, y = resolution.height * 0.85, delay = 10 * 10) {
        super(message, x, y)
        this.delay = delay
        this.current = 0
    }

    dibujar() {
        if (this.current <= this.delay) {
            var fill = contexto.fillStyle
            contexto.fillStyle = 'rgba(0,0,0,0.5)';
            contexto.fillRect(0, this.y - 50, resolution.width, 2000)
            contexto.fillStyle = fill

            var font = contexto.font
            contexto.font = "1.5vw Consoles, Monaco, monospace";
            super.dibujar()
            contexto.font = font

            this.current++
        }
    }
}