//Obtenemos la referencia a los elementos del DOM

const formulario = document.getElementById('formulario');
const seleccionados = document.getElementById("seleccionados")
const delegado = document.getElementById("delegado")
const subdelegado = document.getElementById("subDelegado")
const numVotos = document.getElementById("numVotos")
const botonGuardar = document.getElementById("btnGuardar");
const botonEliminar = document.getElementById("btnEliminar");

//Al iniciciar la aplicación, si existe listaVotados en el local storage, lo recupera y lo parsea a array formato
//JSON para poder pintar la situación que fue guardada la última vez, tanto el número de votos que se realizaron 
//como las personas que recibieron los votos  


//Este objeto controlará todo

const control = {
    
    listaVotados:[],
    votosEmitidos:0,

    aumentaVoto(id){
        this.listaVotados[id].votos++
        this.votosEmitidos++
        numVotos.textContent = this.votosEmitidos
    },
    insertaVotado(nombre, votos = 0)  {
        this.listaVotados.push({
            nombre: nombre , votos: votos
        })
        const id = this.listaVotados.length-1;
        
        const elementoListaSeleccionados = document.createElement('div');
        elementoListaSeleccionados
            .innerHTML=`    <p>${nombre}</p>
                            <input type="button" class="boton-modificado" value="${votos}" id="C${id}" data-counter>`                     

        //añadimos el elemento a la lista de elementosdom       
        elementoListaSeleccionados.id=nombre


       seleccionados.append(elementoListaSeleccionados)

        //Asignamos los eventos a los botones
        document.getElementById(`C${id}`).addEventListener("click",(event)=>{  
            if (event.target.dataset.counter != undefined ) {
                this.aumentaVoto(id)
                event.target.value++
                this.dameDelegado()
                formulario["nombre"].focus()
            }
        })
    },  
    reseteaFormulario() {
        formulario['nombre'].value=''
        formulario['nombre'].focus()
    },
    dameDelegado(){
        const nombreDelegado =[...this.listaVotados].sort((ele1, ele2)=>
                    ele2.votos - ele1.votos)
        delegado.textContent=`Delegado: ${nombreDelegado[0].nombre}`
        const divDelegado= document.getElementById(`${nombreDelegado[0].nombre}`)
        seleccionados.insertAdjacentElement('afterbegin', divDelegado)
        if (nombreDelegado.length>1){
            subdelegado.textContent=`SubDelegado: ${nombreDelegado[1].nombre}`
            const divSubDelegado= document.getElementById(`${nombreDelegado[1].nombre}`)
            divDelegado.insertAdjacentElement('afterend', divSubDelegado)

        }
       
    },

    guardaProgreso(){
        localStorage.setItem('listaVotados', JSON.stringify(control.listaVotados));
    },

    eliminarProgreso(){
        while(this.listaVotados.length > 0) {
            this.listaVotados.pop();
        }
        while (seleccionados.firstChild) {
            seleccionados.removeChild(seleccionados.firstChild);
        }
        localStorage.clear();
        numVotos.textContent = 0;
        delegado.textContent = '';
        subdelegado.textContent = '';
    }

}

if (localStorage.getItem('listaVotados')){
    const arrayGuardado = localStorage.getItem('listaVotados');
    const arrayRecuperado = JSON.parse(arrayGuardado);
    const votosRecuperados = arrayRecuperado.reduce ((acumu,el)=>acumu+el.votos,0);
    control.votosEmitidos=votosRecuperados;
    numVotos.textContent = votosRecuperados;
    arrayRecuperado.forEach(el => {
    control.insertaVotado(el.nombre, el.votos);        
    control.reseteaFormulario();  
    control.dameDelegado();
     })
     };

//El submit
formulario.addEventListener("submit", (event)=> {
    event.preventDefault();
    if ( formulario['nombre'].value !== "") {
        control.insertaVotado(formulario['nombre'].value)          
        control.reseteaFormulario()    
    }

});

//Boton Guardar 
botonGuardar.addEventListener("click", (event) => {
    event.preventDefault();
    control.guardaProgreso();
   
   
});

//Boton Eliminar
botonEliminar.addEventListener("click", (event) => {
    event.preventDefault();
    control.eliminarProgreso();
      
});



