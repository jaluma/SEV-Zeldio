class GameLayer extends Layer {

    constructor() {
        super();

        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(0);

        this.botonSalto = new Boton(imagenes.boton_salto, resolution.width * 0.9, resolution.height * 0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo, resolution.width * 0.75, resolution.height * 0.83);
        this.pad = new Pad(resolution.width * 0.14, resolution.height * 0.8);

        this.scrollX = 0;
        this.bloques = [];

        this.fondo = new Fondo(imagenes.fondo_2, resolution.width * 0.5, resolution.height * 0.5);

        this.enemigos = [];

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, resolution.width * 0.85, resolution.height * 0.05);

        this.puntos = new Texto(0, resolution.width * 0.9, resolution.height * 0.07);
        this.cargarMapa("res/" + nivelActual + ".txt");
    }

    actualizar() {
        this.espacio.actualizar();

        // elementos fuera
        // Enemigos muertos fuera del juego
        for (var j = 0; j < this.enemigos.length; j++) {
            if (this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto) {

                this.espacio.eliminarCuerpoDinamico(this.enemigos[j]);

                this.enemigos.splice(j, 1);
                j = j - 1;
            }
        }

        this.jugador.actualizar();
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }

        // colisiones
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.iniciar();
            }
        }

    }

    calcularScroll() {
        this.scrollX = this.jugador.x - resolution.width / 2;
        this.scrollY = this.jugador.y - resolution.height / 2;
    }


    dibujar() {
        this.calcularScroll();

        this.fondo.dibujar();
        for (var i = 0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar(this.scrollX, this.scrollY);
        }

        this.jugador.dibujar(this.scrollX, this.scrollY);
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        // HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();

        // if (!this.pausa && entrada == entradas.pulsaciones) {
        //     this.botonDisparo.dibujar();
        //     this.botonSalto.dibujar();
        //     this.pad.dibujar();
        // }

    }


    procesarControles() {
        // disparar
        if (controles.atacar) {
            var nuevoAtaque = this.jugador.atacar;
            if (nuevoAtaque != null) {
                this.espacio.agregarCuerpoDinamico(nuevoAtaque);
                // hacer algo con el ataque
            }
        }

        // Eje X
        if (controles.moverX > 0) {
            this.jugador.moverX(1);
        } else if (controles.moverX < 0) {
            this.jugador.moverX(-1);
        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if (controles.moverY > 0) {
            this.jugador.moverY(1)
        } else if (controles.moverY < 0) {
            this.jugador.moverY(-1)
        } else {
            this.jugador.moverY(0)
        }

    }

    cargarMapa(ruta) {
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function() {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length - 1) * 64;
            this.altoMapa = (lineas.length - 1) * 64;
            for (var i = 0; i < lineas.length; i++) {
                var linea = lineas[i].split(' ');

                for (var j = 0; j < linea.length; j++) {
                    var simbolo = linea[j];
                    var x = 64 / 2 + j * 64; // x central
                    var y = 64 + i * 64; // y de abajo
                    this.cargarObjetoMapa(simbolo, x, y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch (simbolo) {
            case "C":
                this.copa = new Bloque(imagenes.copa, x, y);
                this.copa.y = this.copa.y - this.copa.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.copa);
                break;

            case "E":
                var enemigo = new Enemigo(x, y);

                enemigo.y = enemigo.y - enemigo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "Pl_1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
        }

        // añadimos los bloques
        switch (simbolo) {
            case "C_sd":
                this.añadirBloque(imagenes.cesped_sd, x, y)
                break;
            case "C_si":
                this.añadirBloque(imagenes.cesped_si, x, y)
                break;
            case "C_sc":
                this.añadirBloque(imagenes.cesped_sc, x, y)
                break;
            case "C_ci":
                this.añadirBloque(imagenes.cesped_ci, x, y)
                break;
            case "C_cc":
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
            case "C_cd":
                this.añadirBloque(imagenes.cesped_cd, x, y)
                break;
            case "C_ii":
                this.añadirBloque(imagenes.cesped_ii, x, y)
                break;
            case "C_ic":
                this.añadirBloque(imagenes.cesped_ic, x, y)
                break;
            case "C_id":
                this.añadirBloque(imagenes.cesped_id, x, y)
                break;
            case "Tree":
                this.añadirBloque(imagenes.tree, x, y)
                break;
            default:
                this.añadirBloque(imagenes.cesped_cc, x, y)
        }
    }

    añadirBloque(imagen, x, y) {
        var bloque = new Bloque(imagen, x, y);
        bloque.y = bloque.y - bloque.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(bloque);
    }

    calcularPulsaciones(pulsaciones) {
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;

        // suponemos que el pad está sin tocar
        controles.moverX = 0;
        controles.moverY = 0;

        for (var i = 0; i < pulsaciones.length; i++) {
            if (this.pad.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if (orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = 1;
                }
                if (orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = -1;
                }
            }


            if (this.botonDisparo.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonDisparo.pulsado = true;
                if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonSalto.pulsado = true;
                if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if (!this.botonDisparo.pulsado) {
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if (!this.botonSalto.pulsado) {
            controles.moverY = 0;
        }
    }


}