# Sistema Interactivo de Reserva de Vuelos

## Descripción del problema

Una aerolínea necesita un sistema simple, que funcione desde el navegador,
para que un operador registre reservas de vuelo de manera interactiva.
El sistema debe controlar el cupo disponible del vuelo y calcular el costo
de cada pasaje según el peso del equipaje, el cual el empleado ingresara
mediante ventanas emergentes (prompt/alert) y la consola

## Funcionamiento

1. El operador ingresa el **código del vuelo** (ej: `AR1400`) mediante `prompt`.
   Puede escribir `salir` o presionar *Cancelar* para cerrar el sistema.
2. El sistema muestra los **asientos disponibles** y solicita la cantidad de
   pasajeros del grupo.
3. Si hay cupo suficiente, se registra a cada pasajero:
   - Nombre y apellido.
   - Peso del equipaje en kg.
4. Se calcula el costo de cada pasaje:
   - **Precio base:** $150.
   - **Recargo por exceso de equipaje:** +$50 si el equipaje supera los 23 kg.
5. Al finalizar el grupo, se muestra un **resumen de la reserva**: vuelo,
   pasajeros confirmados y monto total a pagar.
6. Si el vuelo se queda sin asientos, el sistema informa **sin cupo** y se cierra.

## Tipos de funciones aplicadas
-Funciones Flecha (Arrow Functions): Utilizadas para operaciones lógicas y validaciones
 rápidas, como excedePeso y cantidadValida.   

-Funciones de Entrada de Datos: Encargadas de interactuar con el usuario mediante 
 prompt para capturar el código de vuelo, la cantidad de pasajeros, nombres y el 
 peso del equipaje (solicitarCodigoVuelo, solicitarNombrePasajero, etc.).   

-Funciones de Procesamiento: Realizan los cálculos matemáticos puros para determinar
 recargos y costos totales (calcularRecargo, calcularCostoFinal).   

-Funciones de Visualización: Muestran los resultados parciales y finales tanto en interfaces visuales (alert) como en la consola

-Función Principal: procesarReserva, que coordina el flujo iterativo de registro por 
 cada pasajero dentro de un grupo

## Ambito de las varibles (Scope)
-Variables Globales (let y const): Declaradas al inicio del script, como asientosDisponibles, sistemaActivo, 
 PRECIO_BASE, RECARGO_EXCESO y LIMITE_EQUIPAJE_KG. Mantienen el estado general del sistema y las 
 configuraciones de tarifas a lo largo de toda la ejecución.
 
-Variables Locales: Utilizadas dentro de las funciones y bucles (como totalReserva, confirmados, nombre, peso, 
 recargo), cuyo ámbito está estrictamente limitado al bloque de código donde son declaradas, evitando 
 efectos secundarios no deseados

## Datos iniciales

| Variable | Valor |
|---|---|
| Asientos disponibles | 4 |
| Precio base | $150 |
| Recargo por exceso | $50 |
| Límite de equipaje | 23 kg |

## Ejecución

Abrir `index.html` en un navegador (con `main.js` enlazado) y seguir las
indicaciones que aparecen en pantalla. Los registros de cada pasaje se
muestran también en la consola del navegador.



