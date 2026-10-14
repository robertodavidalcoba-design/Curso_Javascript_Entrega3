// ============================================================
// SIMULADOR DE RESERVA DE VUELOS 
// ============================================================

// --- Variables y constantes globales ---
let asientosDisponibles = 4;
let sistemaActivo = true;
const PRECIO_BASE = 150.0;
const RECARGO_EXCESO = 50.0;
const LIMITE_EQUIPAJE_KG = 23.0;

// ============================================================
// FUNCIONES FLECHA 
// ============================================================

const excedePeso = (peso, limite) => peso > limite;

const cantidadValida = (cantidad, disponibles) => Number.isInteger(cantidad) && cantidad > 0 && cantidad <= disponibles;

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
        `Vuelo ${codigoVuelo} (Asientos disponibles: ${disponibles})\n¿Cuántos pasajeros desea registrar en este grupo?`
    );
    return Number(texto);
}

// Pide el nombre del pasajero y lo devuelve como texto (string)
function solicitarNombrePasajero(numero, total) {
    let nombre = prompt(`Pasajero ${numero} de ${total}:\nIngrese el nombre y apellido:`);
    if (nombre === null || nombre.trim() === "") {
        return `Pasajero ${numero}`;
    }
    return nombre.trim();
}

// Pide el peso del equipaje y lo devuelve como número
function solicitarPesoPasajero(nombre) {
    let peso = Number(prompt(`Ingrese el peso del equipaje (en kg) para ${nombre}:`));
    while (isNaN(peso) || peso < 0) {
        peso = Number(prompt(`Peso inválido. Ingrese nuevamente el peso (en kg) para ${nombre}:`));
    }
    return peso;
}

// ============================================================
// FUNCIONES DE PROCESAMIENTO
// ============================================================

// Calcula únicamente el recargo
function calcularRecargo(pesoMaleta, recargoExceso) {
    if (excedePeso(pesoMaleta, LIMITE_EQUIPAJE_KG)) {
        return recargoExceso;
    }
    return 0;
}

// Calcula el costo final sumando la base y el recargo
function calcularCostoFinal(precioBase, recargo) {
    return precioBase + recargo;
}

// ============================================================
// FUNCIONES MOSTRAR POR PANTALLA
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
    console.log(`Reserva vuelo ${codigoVuelo}: ${confirmados} pasajero(s) - Total $${total}`);
}

// ============================================================
// FUNCIÓN PRINCIPAL 
// ============================================================

function procesarReserva(codigoVuelo, cantidad, asientos, precioBase) {
    let totalReserva = 0;
    let confirmados = 0;

    for (let i = 1; i <= cantidad; i++) {
        if (asientos > 0) {
            // Usamos funciones separadas para pedir el nombre y el peso de forma independiente
            let nombre = solicitarNombrePasajero(i, cantidad);
            let peso = solicitarPesoPasajero(nombre);

            // Calculamos recargo y costo usando variables simples
            let recargo = calcularRecargo(peso, RECARGO_EXCESO);
            let costo = calcularCostoFinal(precioBase, recargo);

            mostrarPasajero(nombre, peso, recargo, costo, precioBase);

            totalReserva += costo;
            asientos--;
            confirmados++;
        }
    }

    mostrarResumen(codigoVuelo, confirmados, totalReserva);
    return confirmados; // Devolvemos solo un número en lugar de un objeto
}

// ============================================================
// PROGRAMA PRINCIPAL
// ============================================================
alert("=== SISTEMA INTERACTIVO DE RESERVA DE VUELOS ===");

while (sistemaActivo) {
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

        if (cantidadValida(cantidad, asientosDisponibles)) {
            // procesarReserva ahora devuelve directamente el número de confirmados
            const confirmadosProcesados = procesarReserva(codigoVuelo, cantidad, asientosDisponibles, PRECIO_BASE);
            asientosDisponibles -= confirmadosProcesados;
        } else {
            alert(`[ERROR] Cantidad inválida o sin cupo suficiente.\nAsientos disponibles: ${asientosDisponibles}`);
        }
    }
}