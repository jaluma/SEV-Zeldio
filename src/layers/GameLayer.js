class GameLayer extends Layer {

    constructor() {
        super();

        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(0);

        this.scrollX = 0;
        this.bloques = [];

        this.fondo = new Fondo(imagenes.fondo_2, resolution.width * 0.5, resolution.height * 0.5);

        this.generadoresEnemigos = []
        this.enemigos = [];
        this.npcs = []

        this.coleccionables = []
        this.interactuables = []
        this.texto = null

        this.inventario = new Inventario(resolution.width * 0.1, resolution.height * 0.90)

        this.iconoMonedas = new Fondo(imagenes.moneda, resolution.width * 0.85, resolution.height * 0.05);
        this.monedas = new Texto(0, resolution.width * 0.9, resolution.height * 0.07);

        this.cargarMapa("res/" + nivelActual + ".txt");

        // cargar despues del mapa cuando se sepa las vidas del jugador
        this.iconoVidas = []
        var initialX = 0.1
        for (var i = 0; i < this.jugador.vidas; i++) {
            var x = parseFloat(initialX + i * 0.03).toFixed(2)
            this.iconoVidas.push(new Fondo(imagenes.icono_vidas, resolution.width * x, resolution.height * 0.05))
        }

        var texto = ""
            // iniciamos el nivel (mecanicas)
        switch (nivelActual) {
            case 0:
                texto = "Mata los enemigos para avanzar."
                break;
            case 1:
                texto = "¿Tendrás la suerte necesaria?"
                this.colocarObjeto(Cofre)
                break;
            case 2:
                texto = "No solo necesitas suerte, sino también paciencia."
                    // algo
                break;
            case 3:
                texto = "¿Cómo va la memoria?"
                this.generarOrden(Placa)
                this.orden = 0
                break;
        }

        if (texto !== "") {
            this.texto = new TextoBocadillo("Nivel " + (nivelActual + 1) + ": " + texto)
        }
    }

    colocarObjeto(prototype) {
        var list = this.interactuables.filter(i => i instanceof prototype)
        var index = Math.floor(Math.random() * (list.length))

        list[index].objeto = new Llave()
    }

    generarOrden(prototype) {
        var array = this.shuffle(Array.from({ length: this.interactuables.filter(i => i instanceof prototype).length }, (_, id) => ({ id })))
        var count = 0;
        for (var i = 0; i < this.interactuables.length; i++) {
            if (this.interactuables[i] instanceof prototype) {
                this.interactuables[i].orden = array[count++].id
            }
        }
    }

    shuffle(array) {
        for (var i = array.length; i > 1; i--) {
            var r = Math.floor(Math.random() * i);
            var temp = array[r];
            array[r] = array[i - 1];
            array[i - 1] = temp;
        }
        return array
    }

    async actualizar() {
        this.espacio.actualizar();

        for (var i = 0; i < this.matrizCaminos.length; i++) {
            for (var j = 0; j < this.matrizCaminos[i].length; j++) {
                if (this.matrizCaminos[i][j] === estadosMC.jugador) {
                    this.matrizCaminos[i][j] = estadosMC.vacio
                }
                if (this.matrizCaminos[i][j] === estadosMC.npc) {
                    this.matrizCaminos[i][j] = estadosMC.vacio
                }
            }
        }
        this.marcar(this.jugador, estadosMC.jugador)

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
        for (var i = 0; i < this.npcs.length; i++) {
            this.npcs[i].actualizar();
            this.marcar(this.npcs[i], estadosMC.npc)
            if (this.npcs[i].colisiona(this.jugador)) {
                if (this.jugador.isInteractuar()) {
                    var object = this.npcs[i].interactuar()
                    break;
                }
            }
            if (this.npcs[i].isMovimiendo()) {
                this.espacio.eliminarCuerpoEstatico(this.npcs[i])
            } else {
                this.espacio.agregarCuerpoEstatico(this.npcs[i])
            }
        }
        for (var i = 0; i < this.generadoresEnemigos.length; i++) {
            this.generadoresEnemigos[i].actualizar();
        }
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }
        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].actualizar();
        }
        for (var i = 0; i < this.interactuables.length; i++) {
            this.interactuables[i].actualizar();
        }
        for (var i = 0; i < this.bloques.length; i++) {
            this.bloques[i].actualizar();
        }
        for (var i = 0; i < this.bloques.length; i++) {
            if (this.bloques[i].isDestruible()) {
                if (this.bloques[i].isSaltable() && this.jugador.colisiona(this.bloques[i])) {
                    this.destruirBloques(i)
                }
            }
        }

        // colisiones
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.jugador.perderVida()

                this.enemigos.splice(i, 1);
                i = i - 1;
            }
        }

        for (var i = 0; i < this.coleccionables.length; i++) {
            if (this.jugador.colisiona(this.coleccionables[i])) {
                this.coleccionables[i].colision(this.jugador);

                this.coleccionables.splice(i, 1);
                i = i - 1;
            }
        }

        for (var i = 0; i < this.interactuables.length; i++) {
            if (this.interactuables[i].colisiona(this.jugador)) {
                if (this.jugador.isInteractuar() || !this.interactuables[i].activarConBoton) {
                    var object = await this.interactuables[i].interactuar(i)
                    if (typeof object === "string") {
                        this.texto = new TextoBocadillo(object)
                    } else if (object !== null) {
                        if (object instanceof Llave) {
                            this.texto = new TextoBocadillo(object.texto)
                            this.inventario.añadir(object)
                            this.jugador.inventario.push(object)
                        }
                    }
                    break;
                }
            }
        }

        this.monedas.valor = this.jugador.monedas

        var vidasAEliminar = this.iconoVidas.length - this.jugador.vidas
        if (vidasAEliminar > 0) {
            this.iconoVidas.splice(this.iconoVidas.length - vidasAEliminar, vidasAEliminar);
        }


        if (this.puntoSalvado != null && this.jugador.colisiona(this.puntoSalvado)){
            if (!this.saved)
                layer.texto = new TextoBocadillo("Punto de salvado alcanzado.")
            this.saved = true;
        }
    }

    destruirBloques(i) {
        if (this.bloques[i].estado == estadosTile.roto) {
            // creamos un nuevo elemento
            //var bf = new Bloque(this.bloquePorDefecto, this.bloques[i].x, this.bloques[i].y)
            var b = new Bloque(imagenes.tablon, this.bloques[i].x, this.bloques[i].y)
            //this.bloques.push(bf);
            //this.espacio.agregarCuerpoEstatico(bf)
            this.bloques.push(b)
            this.espacio.agregarCuerpoEstatico(b)
                // eliminamos el anterior
            this.bloques.splice(i, 1);
            i = i - 1;

            // mover al jugador
            this.texto = new TextoBocadillo("¡Te has caído!");
            if (this.saved == null || !this.saved){
                this.jugador.x = this.spawnX;
                this.jugador.y = this.spawnY;
            }
            else{
                this.jugador.x = this.puntoSalvado.x
                this.jugador.y = this.puntoSalvado.y
            }
        } else {
            this.bloques[i].destruir();
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
        for (var i = 0; i < this.coleccionables.length; i++) {
            this.coleccionables[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i = 0; i < this.interactuables.length; i++) {
            this.interactuables[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i = 0; i < this.generadoresEnemigos.length; i++) {
            this.generadoresEnemigos[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i = 0; i < this.npcs.length; i++) {
            this.npcs[i].dibujar(this.scrollX, this.scrollY);
        }
        this.jugador.dibujar(this.scrollX, this.scrollY);

        // HUD
        this.iconoMonedas.dibujar();
        this.monedas.dibujar();

        for (var i = 0; i < this.iconoVidas.length; i++) {
            this.iconoVidas[i].dibujar()
        }
        if (this.texto !== null) {
            this.texto.dibujar(this.scrollX, this.scrollY);
        }
        this.inventario.dibujar()
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

        if (controles.interactuar) {
            this.jugador.interactuar = true
        } else {
            this.jugador.interactuar = false
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

            this.bloquePorDefecto = this.cargarObjetoMapa(lineas[0], 0, 0).path
            this.bloques.splice(0, 1)

            lineas.splice(0, 1)

            this.anchoMapa = (lineas[0].split(' ').length) * 64; // restamos uno de mas porq la primera no cuenta
            this.altoMapa = (lineas.length) * 64;

            // inicializmaos la matriz a 0
            this.matrizCaminos = Array.from(Array(this.altoMapa / 64), () => Array.from(Array(this.anchoMapa / 64), () => estadosMC.vacio))

            for (var i = 0; i < lineas.length; i++) {
                var linea = lineas[i].split(' ');

                for (var j = 0; j < linea.length; j++) {
                    var simbolo = linea[j];
                    var x = 64 / 2 + j * 64; // x central
                    var y = 64 + i * 64; // y de abajo
                    this.cargarObjetoMapa(simbolo, x, y, this.bloquePorDefecto);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y, bloquePorDefecto = imagenes.cesped_cc) {
        switch (simbolo) {
            case "Pl_1":
                // jugador 1
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.marcar(this.jugador, estadosMC.jugador)

                // guardamos los puntos de spawn
                this.spawnX = this.jugador.x
                this.spawnY = this.jugador.y
                break;
            case "G_En":
                // Generador de enemigos
                var generadorEnemigos = new GeneradorEnemigos(imagenes.teleport_azul, x, y, 2)
                generadorEnemigos.y = generadorEnemigos.y - generadorEnemigos.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.generadoresEnemigos.push(generadorEnemigos)
                this.marcar(generadorEnemigos)
                this.espacio.agregarCuerpoEstatico(generadorEnemigos);
                this.añadirBloque(imagenes.cesped_cc, x, y)
                break;
        }

        switch (simbolo) {
            case "Falo":
                // falo
                this.falo = new Falo(x, y)
                this.falo.y = this.falo.y - this.falo.alto / 2;
                this.initialFalox = x;
                this.npcs.push(this.falo);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.camino_centro, x, y)
                this.espacio.agregarCuerpoDinamico(this.falo);
                this.marcar(this.falo, estadosMC.npc)
                this.espacio.agregarCuerpoEstatico(this.falo);
                break;
            case "Mari":
                // mario
                break;
        }

        // objetos del mapa
        switch (simbolo) {
            case this.getCase(simbolo, "ArbP"):
                // arbol verde
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.treeP, x, y)
                break;
            case this.getCase(simbolo, "ArbC"):
                // arbol rojo
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloqueEstatico(imagenes.treeC, x, y)
                break;
            case this.getCase(simbolo, "Mone"):
                // moneda
                var moneda = new Moneda(imagenes.moneda, x, y);
                moneda.y = moneda.y - moneda.alto / 2;
                this.coleccionables.push(moneda);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.espacio.agregarCuerpoDinamico(moneda);
                break;
            case this.getCase(simbolo, "Moai"):
                // moai
                var moai = new Moai(x, y);
                this.añadirBloque(bloquePorDefecto, x, y)
                this.añadirBloque(imagenes.pedestal, x, y)
                this.marcar(moai)
                this.añadirModeloEstatico(moai)
                break;
            case this.getCase(simbolo, "CofA"):
                // cofre
                var modelo = new Cofre(x, y);
                this.añadirBloque(bloquePorDefecto, x, y)
                modelo.y = modelo.y - modelo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.interactuables.push(modelo);
                this.marcar(modelo)
                this.espacio.agregarCuerpoEstatico(modelo)
                break;
            case this.getCase(simbolo, "Plac"):
                // placa
                var modelo = new Placa(x, y);
                this.añadirBloque(bloquePorDefecto, x, y)
                modelo.y = modelo.y - modelo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.interactuables.push(modelo);
                break;
            case this.getCase(simbolo, "Door"):
                // trampilla
                var modelo = new Trampilla(imagenes.trampilla, x, y, true)
                this.añadirBloque(bloquePorDefecto, x, y)
                modelo.y = modelo.y - modelo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.interactuables.push(modelo);
                break;
            case this.getCase(simbolo, "Strs"):
                // escalera
                var modelo = new Puerta(imagenes.escalera, x, y, true)
                this.añadirBloque(bloquePorDefecto, x, y)
                modelo.y = modelo.y - modelo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.interactuables.push(modelo);
                break;
            case this.getCase(simbolo, "Save"):
                // Generador de enemigos
                this.añadirBloque(imagenes.madera_h, x, y)
                this.puntoSalvado = new Bloque(imagenes.teleport_naranja, x, y, new Animacion(imagenes.teleport_naranja_a, this.ancho, this.alto, 6, 3))
                this.puntoSalvado.y =  this.puntoSalvado.y -  this.puntoSalvado.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(this.puntoSalvado)
                this.espacio.agregarCuerpoDinamico(this.puntoSalvado);

                break;
        }

        // añadimos los bloques
        // cesped
        switch (simbolo) {
            case this.getCase(simbolo, "0000"):
                //muro invisible
                this.añadirBloqueEstatico(imagenes.transparente, x, y)
                break;
            case this.getCase(simbolo, "C_si"):
                return this.añadirBloque(imagenes.cesped_si, x, y)
            case this.getCase(simbolo, "C_sc"):
                return this.añadirBloque(imagenes.cesped_sc, x, y)
            case this.getCase(simbolo, "C_sd"):
                return this.añadirBloque(imagenes.cesped_sd, x, y)
            case this.getCase(simbolo, "C_ci"):
                return this.añadirBloque(imagenes.cesped_ci, x, y)
            case this.getCase(simbolo, "C_cc"):
                return this.añadirBloque(imagenes.cesped_cc, x, y)
            case this.getCase(simbolo, "C_cd"):
                return this.añadirBloque(imagenes.cesped_cd, x, y)
            case this.getCase(simbolo, "C_ii"):
                return this.añadirBloque(imagenes.cesped_ii, x, y)
            case this.getCase(simbolo, "C_ic"):
                return this.añadirBloque(imagenes.cesped_ic, x, y)
            case this.getCase(simbolo, "C_id"):
                return this.añadirBloque(imagenes.cesped_id, x, y)
        }

        // caminos de tierra
        switch (simbolo) {
            case this.getCase(simbolo, "Ca_s"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.camino_sup, x, y)
            case this.getCase(simbolo, "Ca_a"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.camino_abajo, x, y)
            case this.getCase(simbolo, "Ca_c"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.camino_centro, x, y)
            case this.getCase(simbolo, "Ca_i"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.camino_izqda, x, y)
            case this.getCase(simbolo, "Ca_d"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.camino_dcha, x, y)
            case this.getCase(simbolo, "Cr_d"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.cruce_supdcha, x, y)
            case this.getCase(simbolo, "Cr_i"):
                this.añadirBloque(bloquePorDefecto, x, y)
                return this.añadirBloque(imagenes.cruce_supizqda, x, y)
            case this.getCase(simbolo, "CaAi"):
                this.añadirBloque(imagenes.aguacentro, x, y)
                return this.añadirBloque(imagenes.camino_izqda, x, y)
            case this.getCase(simbolo, "CaAd"):
                this.añadirBloque(imagenes.aguacentro, x, y)
                return this.añadirBloque(imagenes.camino_dcha, x, y)
            case this.getCase(simbolo, "CAii"):
                this.añadirBloque(imagenes.aguainf, x, y)
                return this.añadirBloque(imagenes.camino_izqda, x, y)
            case this.getCase(simbolo, "CAdi"):
                this.añadirBloque(imagenes.aguainf, x, y)
                return this.añadirBloque(imagenes.camino_dcha, x, y)
        }

        // suelo de madera
        switch (simbolo) {
            case this.getCase(simbolo, "Madh"):
                var bloque = new TileDestruible(imagenes.madera_h, x, y);
                bloque.y = bloque.y - bloque.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                return bloque
            case this.getCase(simbolo, "Madv"):
                var bloque = new TileDestruible(imagenes.madera_v, x, y);
                bloque.y = bloque.y - bloque.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                return bloque
            case this.getCase(simbolo, "Ma_h"):
                return this.añadirBloque(imagenes.madera_h, x, y)
            case this.getCase(simbolo, "Ma_v"):
                return this.añadirBloque(imagenes.madera_v, x, y)
        }

        // baldosas
        switch (simbolo) {
            case this.getCase(simbolo, "B_si"):
                return this.añadirBloque(imagenes.baldosa_si, x, y)
            case this.getCase(simbolo, "B_sc"):
                return this.añadirBloque(imagenes.baldosa_sc, x, y)
            case this.getCase(simbolo, "B_sd"):
                return this.añadirBloque(imagenes.baldosa_sd, x, y)
            case this.getCase(simbolo, "B_ci"):
                return this.añadirBloque(imagenes.baldosa_ci, x, y)
            case this.getCase(simbolo, "B_cc"):
                return this.añadirBloque(imagenes.baldosa_cc, x, y)
            case this.getCase(simbolo, "B_cd"):
                return this.añadirBloque(imagenes.baldosa_cd, x, y)
            case this.getCase(simbolo, "B_ii"):
                return this.añadirBloque(imagenes.baldosa_ii, x, y)
            case this.getCase(simbolo, "B_ic"):
                return this.añadirBloque(imagenes.baldosa_ic, x, y)
            case this.getCase(simbolo, "B_id"):
                return this.añadirBloque(imagenes.baldosa_id, x, y)
        }

        // cemento
        switch (simbolo) {
            case this.getCase(simbolo, "M_si"):
                return this.añadirBloqueEstatico(imagenes.cemento_si, x, y)
            case this.getCase(simbolo, "M_sc"):
                return this.añadirBloqueEstatico(imagenes.cemento_sc, x, y)
            case this.getCase(simbolo, "M_sd"):
                return this.añadirBloqueEstatico(imagenes.cemento_sd, x, y)
            case this.getCase(simbolo, "M_ci"):
                return this.añadirBloqueEstatico(imagenes.cemento_ci, x, y)
            case this.getCase(simbolo, "M_cc"):
                return this.añadirBloque(imagenes.cemento_cc, x, y)
            case this.getCase(simbolo, "M_cd"):
                return this.añadirBloqueEstatico(imagenes.cemento_cd, x, y)
            case this.getCase(simbolo, "M_ii"):
                return this.añadirBloqueEstatico(imagenes.cemento_ii, x, y)
            case this.getCase(simbolo, "M_ic"):
                return this.añadirBloqueEstatico(imagenes.cemento_ic, x, y)
            case this.getCase(simbolo, "M_id"):
                return this.añadirBloqueEstatico(imagenes.cemento_id, x, y)
        }

        // castillo
        switch (simbolo) {
            case this.getCase(simbolo, "Cas1"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast1, x, y)
                break;
            case this.getCase(simbolo, "Cas2"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloque(imagenes.camino_izqda, x, y)
                this.añadirBloqueEstatico(imagenes.cast2, x, y)
                break;
            case this.getCase(simbolo, "Cas3"):
                // será la puerta a el siguiente nivel
                this.añadirBloque(imagenes.camino_centro, x, y)
                var puerta = new Puerta(imagenes.cast3, x, y, true)
                puerta.y = puerta.y - puerta.alto / 2;
                this.interactuables.push(puerta);
                break;
            case this.getCase(simbolo, "Cas4"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloque(imagenes.camino_dcha, x, y)
                this.añadirBloqueEstatico(imagenes.cast4, x, y)
                break;
            case this.getCase(simbolo, "Cas5"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast5, x, y)
                break;
            case this.getCase(simbolo, "Cas6"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast6, x, y)
                break;
            case this.getCase(simbolo, "Cas7"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast7, x, y)
                break;
            case this.getCase(simbolo, "Cas8"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast8, x, y)
                break;
            case this.getCase(simbolo, "Cas9"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast9, x, y)
                break;
            case this.getCase(simbolo, "Ca10"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast10, x, y)
                break;
            case this.getCase(simbolo, "Ca11"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast11, x, y)
                break;
            case this.getCase(simbolo, "Ca12"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast12, x, y)
                break;
            case this.getCase(simbolo, "Ca13"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast13, x, y)
                break;
            case this.getCase(simbolo, "Ca14"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast14, x, y)
                break;
            case this.getCase(simbolo, "Ca15"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast15, x, y)
                break;
            case this.getCase(simbolo, "Ca16"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast16, x, y)
                break;
            case this.getCase(simbolo, "Ca17"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                this.añadirBloqueEstatico(imagenes.cast17, x, y)
                break;
        }

        // awa
        switch (simbolo) {
            case this.getCase(simbolo, "AgSD"):
                this.añadirBloqueEstatico(imagenes.aguasupcha, x, y)
                break;
            case this.getCase(simbolo, "Asup"):
                this.añadirBloqueEstatico(imagenes.aguasup, x, y)
                break;
            case this.getCase(simbolo, "Adch"):
                this.añadirBloqueEstatico(imagenes.aguadcha, x, y)
                break;
            case this.getCase(simbolo, "Actr"):
                this.añadirBloqueEstatico(imagenes.aguacentro, x, y)
                break;
            case this.getCase(simbolo, "Aizq"):
                this.añadirBloqueEstatico(imagenes.aguaizqda, x, y)
                break;
            case this.getCase(simbolo, "AgSI"):
                this.añadirBloque(imagenes.cesped_sc, x, y)
                this.añadirBloqueEstatico(imagenes.aguasupizqda, x, y)
                break;
            case this.getCase(simbolo, "AgID"):
                this.añadirBloque(imagenes.cesped_cd, x, y)
                this.añadirBloqueEstatico(imagenes.aguainfdcha, x, y)
                break;
            case this.getCase(simbolo, "Ainf"):
                this.añadirBloqueEstatico(imagenes.aguainf, x, y)
                break;
            case this.getCase(simbolo, "AgII"):
                this.añadirBloque(imagenes.cesped_cc, x, y)
                this.añadirBloqueEstatico(imagenes.aguainfizqda, x, y)
                break;
        }
    }

    getCase(symbol, c) {
        var rt = symbol.includes(c)
        return rt ? symbol : ''
    }

    añadirBloqueEstatico(imagen, x, y) {
        var bloque = this.añadirBloque(imagen, x, y)
        this.marcar(bloque)
        this.espacio.agregarCuerpoEstatico(bloque)
        return bloque
    }

    añadirBloque(imagen, x, y) {
        var bloque = new Bloque(imagen, x, y);
        bloque.y = bloque.y - bloque.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(bloque);
        return bloque
    }

    añadirModeloEstatico(modelo) {
        modelo.y = modelo.y - modelo.alto / 2;
        // modificación para empezar a contar desde el suelo
        this.bloques.push(modelo);
        this.marcar(modelo)
        this.espacio.agregarCuerpoEstatico(modelo)
        return modelo
    }

    marcar(modelo, valor = estadosMC.bloque) {
        if (modelo.x >= 0 && modelo.y >= 0) {
            // bloques de arriba a la izquierda
            var i = Math.floor(modelo.y / 64)
            var j = Math.floor((modelo.x - modelo.ancho / 2) / 64) // centro
            this.matrizCaminos[i][j] = valor
        }
    }
}