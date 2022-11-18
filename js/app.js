// Variables y Selector
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Events
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGastos)
}



// Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        
        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado;
    }
    
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extrayendo los valores
        const {presupuesto, restante} = cantidad;
            // Generando los html
            document.querySelector('#total').textContent = presupuesto;
            document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {

            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent  = mensaje;

        // Insertar en html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar el texto
        setTimeout(()=> {
            divMensaje.remove()
        }, 3500);
    }

    mostrarGastos(gasto) {

        this.limpiarHtml();


        //Iterar sobre los gastos
        gasto.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            
            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            

            // Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;


            // Boton para agregar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent =`X`;
            nuevoGasto.appendChild(btnBorrar);

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }


            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }
    limpiarHtml() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')

        // Comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-sucess', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto/2 >= restante) ) {
            restanteDiv.classList.remove('alert-sucess');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    
        // Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}

// Instanciar
const ui = new UI()
let presupuesto;


// Functions
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
        presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)
    
    ui.insertarPresupuesto(presupuesto);
}

function agregarGastos(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return
    } else if ( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    // añadir nuevo gasto
    presupuesto.nuevoGasto(gasto);
    
    // alerta de gasto correcto
    ui.imprimirAlerta('Gasto agregado correctamente');
    
    // Imprimir los gastos
    const { gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();

}

function eliminarGasto(id) {
    //Los elimina del objeto
    presupuesto.eliminarGasto(id)

    //Elimina los gastos del htlm
    const {gastos, restante} =presupuesto;
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}