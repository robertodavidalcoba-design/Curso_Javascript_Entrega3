// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// --- Variables, constantes y arreglos globales ---
let asientosDisponibles = 4;
let sistemaActivo = true;

const PRECIO_BASE = 150.0;
const RECARGO_EXCESO = 50.0;
const LIMITE_EQUIPAJE_KG = 23.0;

// Listado de pasajeros
const l_pasajeros = [];
const l_pesos=[];
const l_costos=[];

const excedePeso = (peso, limite) => peso > limite;

function cantidadValida(cantidad, disponibles) {
    if (isNaN(cantidad)) {
        return false;
    }
    if (cantidad % 1 !== 0) {
        return false;
    }
    if (cantidad <= 0 || cantidad > disponibles) {
        return false;
    }
    return true;
}

// ============================================================
// FUNCIONES DE ENTRADA DE DATOS
// ============================================================

function solicitarCodigoVuelo(mensaje) {
    let codigo = prompt(mensaje);
    if (codigo === null || codigo.trim().toLowerCase() === "salir") {
        return "salir";
    }
    return codigo.trim().toUpperCase();
}

function solicitarCantidadPasajeros(codigoVuelo, disponibles) {
    let texto = prompt('Vuelo ' + codigoVuelo + ' (Asientos disponibles: ' + disponibles +')\n¿Cuántos pasajes desea procesar?');
    return Number(texto);
}

// Pide el peso del equipaje y lo devuelve como número
function solicitarPesoPasajero() {
    let peso = Number(prompt('Ingrese el peso del equipaje (en kg):'));
    while (isNaN(peso) || peso < 0) {
        peso = Number(prompt('Peso inválido. Ingrese nuevamente el peso (en kg)'));
    }
    return peso;
}

// Pide el nombre del pasajero y lo devuelve como texto (string)
function solicitarNombrePasajero() {
    let nombre = prompt('Ingrese el nombre y apellido:');
    while (nombre === null || nombre.trim() === "") {
        nombre = prompt('Nombre inválido. Ingrese nuevamente');
    }
    return nombre.trim();
}

// ============================================================
// FUNCIONES DE PROCESAMIENTO
// ============================================================

function calcularRecargo(pesoMaleta, recargoExceso) {
    if (excedePeso(pesoMaleta, LIMITE_EQUIPAJE_KG)) {
        return recargoExceso;
    }
    return 0;
}

function calcularCostoFinal(precioBase, recargo) {
    return precioBase + recargo;
}

// ============================================================
// FUNCIONES MOSTRAR POR PANTALLA Y CONSOLA
// ============================================================



function mostrarPasajero(nombre, peso, recargo, costo, precioBase) {
    if (recargo > 0) {
        alert('Pasajero:' + nombre + '\nEquipaje: ' + peso + ' kg (Supera los ' + LIMITE_EQUIPAJE_KG + 'kg)\nCosto Boleto: $ ' + precioBase + ' Recargo $ ' + recargo + '= $' + costo);
    } else {
        alert('Pasajero:' + nombre +'\nEquipaje: ' + peso +' kg (Correcto)\nCosto Boleto: $' + precioBase);
    }

    console.log("--- Registro de Pasaje ---");
    console.log("Nombre del pasajero:", nombre);
    console.log("Peso de equipaje:", peso, "kg");
    console.log("Recargo por peso maleta: $", recargo);
    console.log("Precio del pasaje: $", costo);
}

function mostrarResumen(codigoVuelo, confirmados, total) {
    alert('--- RESUMEN DE LA RESERVA ---\nVuelo:' + codigoVuelo +'\nPasajeros confirmados: ' + confirmados + ' Monto total a pagar: $'+ total);
}

// Función que muestra por consola el listado completo final
function imprimirListadoFinalConsola() {
    console.log("\n============================================================");
    console.log("         LISTADO FINAL DE PASAJEROS PROCESADOS              ");
    console.log("============================================================");

    if (l_pasajeros.length === 0) {
        console.log("No se procesó ninguna reserva.");
    } else {
        for (const pasajero of l_pasajeros) {
            console.log('Pasajero:' + pasajero);
        }
        console.log('Total: ' + l_pasajeros.length + ' pasajeros');
    }
    console.log("============================================================\n");
}

// ============================================================
// FUNCIÓN PRINCIPAL DE PROCESAMIENTO
// ============================================================

function procesarReserva(codigoVuelo, cantidad, asientos, precioBase) {
    let totalReserva = 0;
    let confirmados = 0;

    
    for (let i = 0; i < cantidad; i++) {
        if (asientos > 0) {
            let nombre = solicitarNombrePasajero();
            let peso=solicitarPesoPasajero();

            let recargo = calcularRecargo(peso, RECARGO_EXCESO);
            let costo = calcularCostoFinal(precioBase, recargo);

            l_pasajeros.push(nombre.toLowerCase());
            l_pesos.push(peso);
            l_costos.push(costo);

            mostrarPasajero(nombre, peso, recargo, costo, precioBase);

            totalReserva += costo;
            asientos--;
            confirmados++;
        }
    }

    mostrarResumen(codigoVuelo, confirmados, totalReserva);
    return confirmados;
}

// Busca un pasajero en l_pasajeros.
// Devuelve la posición si lo encuentra, o -1 si no está.
function buscarPasajero(buscado) {
    if (l_pasajeros.includes(buscado)) {
        const posicion = l_pasajeros.indexOf(buscado);
        console.log('"' + buscado + '" está en lista, en la posición ' + posicion);
        return posicion;
    } else {
        console.log('"' + buscado + '" no está en lista');
        return -1;
    }
}

// ============================================================
// PROGRAMA PRINCIPAL
// ============================================================
alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");


while (sistemaActivo) {
    
    if (asientosDisponibles <= 0) {
        alert("[SIN CUPO] No quedan asientos disponibles.");
        sistemaActivo = false;
        break;
    }

    const codigoVuelo = solicitarCodigoVuelo(
        "Ingrese el código del vuelo (ej: AR1400) o escriba 'salir' para cerrar el sistema:"
    );

    if (codigoVuelo === "salir") {
        sistemaActivo = false;
        alert("Cerrando sesión del sistema de reservas. ¡Hasta luego!");
    } else {
        const cantidad = solicitarCantidadPasajeros(codigoVuelo, asientosDisponibles);
        if (cantidadValida(cantidad, asientosDisponibles)) {
            const confirmadosProcesados = procesarReserva(codigoVuelo, cantidad, asientosDisponibles, PRECIO_BASE);
            asientosDisponibles -= confirmadosProcesados;
        } else {
           alert('[ERROR] Cantidad inválida.\nAsientos disponibles: ' + asientosDisponibles);
        }
    }
}

// Imprime el listado final por consola al terminar la ejecución del programa
imprimirListadoFinalConsola();

// se solicita si el nombre de un pasajero se encuentra en la lista de vuelo, dado que se produjo un error en el peso del equipaje 
// informado

alert("=== Se debe corregir los datos del pasajero, por favor ingresar sus datos ===");
let nombre = solicitarNombrePasajero();
let posicion = buscarPasajero(nombre.toLowerCase());

if (posicion !== -1) {
    let peso=solicitarPesoPasajero();
    let recargo = calcularRecargo(peso, RECARGO_EXCESO);
    let costo = calcularCostoFinal(PRECIO_BASE, recargo);
    l_pesos.splice(posicion, 1, peso);
    l_costos.splice(posicion, 1, costo);
    console.log('Se registraron los cambios solicitados ');
    for (let i = 0; i < l_pasajeros.length; i++) {
        console.log('Pasajero: ' + l_pasajeros[i] + ' | Maleta: ' + l_pesos[i] + ' kg | Costo: $' + l_costos[i]);
}
} else {
    alert("El pasajero no está en el listado.");
}


