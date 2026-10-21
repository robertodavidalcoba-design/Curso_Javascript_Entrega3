// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// --- Variables, constantes y arreglos globales ---
let asientosDisponibles = 4;
let sistemaActivo = true;
let indicePasajeroActual = 0; // Guardará la posición del próximo pasajero a procesar

const PRECIO_BASE = 150.0;
const RECARGO_EXCESO = 50.0;
const LIMITE_EQUIPAJE_KG = 23.0;

// Arreglos de datos predefinidos
const pasajeros = ["roberto carabajal", "cecilia arias", "pichon lunes", "petaco joel"];
const maletas = [20, 40, 50, 20];
const costos_pasajes = []; // Arreglo donde se guardarán todos los costos calculados

// ============================================================
// FUNCIONES FLECHA 
// ============================================================

const excedePeso = (peso, limite) => peso > limite;

const cantidadValida = (cantidad, disponibles, pendientes) => 
    Number.isInteger(cantidad) && cantidad > 0 && cantidad <= disponibles && cantidad <= pendientes;

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
    let texto = prompt(
        `Vuelo ${codigoVuelo} (Asientos disponibles: ${disponibles})\n¿Cuántos pasajes desea procesar?`
    );
    return Number(texto);
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
        alert(`Pasajero: ${nombre}\nEquipaje: ${peso}kg (Supera los ${LIMITE_EQUIPAJE_KG}kg)\nCosto Boleto: $${precioBase} + Recargo $${recargo} = $${costo}`);
    } else {
        alert(`Pasajero: ${nombre}\nEquipaje: ${peso}kg (Correcto)\nCosto Boleto: $${precioBase}`);
    }

    console.log("--- Registro de Pasaje ---");
    console.log("Nombre del pasajero:", nombre);
    console.log("Peso de equipaje:", peso, "kg");
    console.log("Recargo por peso maleta: $", recargo);
    console.log("Precio del pasaje: $", costo);
}

function mostrarResumen(codigoVuelo, confirmados, total) {
    alert(`--- RESUMEN DE LA RESERVA ---\nVuelo: ${codigoVuelo}\nPasajeros confirmados: ${confirmados}\nMonto total a pagar: $${total}`);
}

// Función que muestra por consola el listado completo final
function imprimirListadoFinalConsola() {
    console.log("\n============================================================");
    console.log("         LISTADO FINAL DE PASAJEROS PROCESADOS              ");
    console.log("============================================================");

    if (costos_pasajes.length === 0) {
        console.log("No se procesó ninguna reserva.");
    } else {
        // Se usa for...of junto con .entries() para obtener el índice y el costo
        // costos_pasajes.entries() devuelve pares de la forma [índice, valor] por ejemplo: [0, 150], [1, 200]
        // Con la desestructuración const [i, costo] of ..., la variable i toma la posición numérica y costo toma el elemento del arreglo de costos, 
        // manteniendo la coincidencia exacta de los datos con pasajeros[i] y maletas[i]
        for (const [i, costo] of costos_pasajes.entries()) {
            console.log(`${i + 1}. Pasajero: ${pasajeros[i]} | Maleta: ${maletas[i]} kg | Costo Pasaje: $${costo}`);
        }
    }
    console.log("============================================================\n");
}

// ============================================================
// FUNCIÓN PRINCIPAL DE PROCESAMIENTO
// ============================================================

function procesarReserva(codigoVuelo, cantidad, asientos, precioBase) {
    let totalReserva = 0;
    let confirmados = 0;

    const limite = indicePasajeroActual + cantidad;

    for (let i = indicePasajeroActual; i < limite; i++) {
        if (asientos > 0) {
            let nombre = pasajeros[i];
            let peso = maletas[i];

            let recargo = calcularRecargo(peso, RECARGO_EXCESO);
            let costo = calcularCostoFinal(precioBase, recargo);

            costos_pasajes.push(costo);

            mostrarPasajero(nombre, peso, recargo, costo, precioBase);

            totalReserva += costo;
            asientos--;
            confirmados++;
            
            indicePasajeroActual++; 
        }
    }

    mostrarResumen(codigoVuelo, confirmados, totalReserva);
    return confirmados;
}

// ============================================================
// PROGRAMA PRINCIPAL
// ============================================================
alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");

while (sistemaActivo) {
    // Si ya procesamos a todos los pasajeros de la lista
    if (indicePasajeroActual >= pasajeros.length) {
        alert("Se han procesado todos los pasajeros registrados en la lista.");
        sistemaActivo = false;
        break;
    }

    const codigoVuelo = solicitarCodigoVuelo(
        "Ingrese el código del vuelo (ej: AR1400) o escriba 'salir' para cerrar el sistema:"
    );

    if (codigoVuelo === "salir") {
        sistemaActivo = false;
        alert("Cerrando sesión del sistema de reservas. ¡Hasta luego!");
    } else if (asientosDisponibles <= 0) {
        alert(`[SIN CUPO] El vuelo ${codigoVuelo} no tiene asientos disponibles.`);
        sistemaActivo = false;
    } else {
        const cantidad = solicitarCantidadPasajeros(codigoVuelo, asientosDisponibles);
        const pasajerosPendientes = pasajeros.length - indicePasajeroActual;

        if (cantidadValida(cantidad, asientosDisponibles, pasajerosPendientes)) {
            const confirmadosProcesados = procesarReserva(codigoVuelo, cantidad, asientosDisponibles, PRECIO_BASE);
            asientosDisponibles -= confirmadosProcesados;
        } else {
            alert(`[ERROR] Cantidad inválida.\nPasajeros restantes en lista: ${pasajerosPendientes}\nAsientos disponibles: ${asientosDisponibles}`);
        }
    }
}

// Imprime el listado final por consola al terminar la ejecución del programa
imprimirListadoFinalConsola();