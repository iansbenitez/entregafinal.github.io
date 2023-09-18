// constante y constructor alumnos

const listaDeAlumnos = JSON.parse(localStorage.getItem("listaDeAlumnos")) || [];

class Alumno {
    constructor(nombreAlumno, apellidoAlumno, notaAlumno) {
        this.nombre = nombreAlumno;
        this.apellido = apellidoAlumno;
        this.nota = notaAlumno;
        this.aprobado = notaAlumno > 6;
    }
}



// Función para no recargar la página

function validarFormulario(e) {
    e.preventDefault();

    document.getElementById("mensajeError").style.display = "none";

    e.target.reset();
}

// Función para chequear si el alumno ya existe

function alumnoExistente(nombre, apellido) {
    return listaDeAlumnos.some(alumno => alumno.nombre === nombre && alumno.apellido === apellido);
}


// Función agregar alumno


function funcionAgregarAlumno() {

    // Mensajes de error y éxito
    document.getElementById("mensajeError").style.display = "none";
    document.getElementById("mensajeOptimo").style.display = "none";


    // Variables para el constructor obtenidas de los inputs
    let nombre = document.getElementById("nombreInput").value;
    let apellido = document.getElementById("apellido").value;
    let nota = parseInt(document.getElementById("nota").value);


    // Manejo de errores de los datos ingresados
    if (!nombre || !isNaN(nombre) || !apellido || !isNaN(apellido) || isNaN(nota) || nota <1 || nota > 10) {
        document.getElementById("mensajeError").style.display = "block";

        setTimeout(()=> {
            document.getElementById("mensajeError").style.display = "none";
        }, 2500);
        return;
    }else{
        if (alumnoExistente(nombre, apellido)) {
            document.getElementById("mensajeError").textContent = "El alumno ya existe.";
            document.getElementById("mensajeError").style.display = "block";
            setTimeout(()=> {
                document.getElementById("mensajeError").style.display = "none";
            
        }, 2500);
            
            return;
        }else{
            document.getElementById("mensajeOptimo").style.display = "block";
            setTimeout(()=> {
                document.getElementById("mensajeOptimo").style.display = "none";
            }, 2500);
        }
        
        
    }


    
    // Finalización clase constructora
    let nuevoAlumno = new Alumno(nombre, apellido, nota);


    // Pusheo al array con el proceso JSON
    listaDeAlumnos.push(nuevoAlumno);
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos));

    // Automáticamente se abre la lista

    mostrarListaDeAlumnos();
    

    //Reseteo de inputs
    document.getElementById("nombreInput").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("nota").value = "";

}


// Creación contenedor de inputs
let contenedorDatos = document.createElement("div");
contenedorDatos.id = "contenedorDatos"

contenedorDatos.innerHTML = `
<h2> Bienvenido a nuestro sistema de alumnos </h2>

<form id="form-test">
<input type="text" id="nombreInput" placeholder="Ingresar nombre..." />
<input type="text" id="apellido" placeholder="Ingresar apellido..." />
<input type="number" id="nota" placeholder="ingresar nota..." />
<input type="button" id="enviarDatos" class="btn-filtro" min="1" max="10" value="Enviar Datos" />
</form>
<p id="mensajeError">Por favor, complete todos los campos.<br>Notas de 1 a 10 únicamente.</p>
<p id="mensajeOptimo"> Alumno agregado, gracias.</p>`;

document.body.append(contenedorDatos);


// Eventos 
let botonEnviarDatos = document.getElementById("enviarDatos");
botonEnviarDatos.addEventListener("click", funcionAgregarAlumno);

let formulario = document.getElementById("form-test");
formulario.addEventListener("reset", validarFormulario);




// Creación contenedor de botones 

let contenedorBotones = document.createElement("div");
contenedorBotones.id = "contenedorBotones";

contenedorBotones.innerHTML = `
<h3>Lista de alumnos</h3>

<button type="button" class="btn btn-mostrar">Mostrar</button>
<button type="button" class="btn btn-ocultar">Ocultar</button>
<p class="d-inline-flex gap-1">
  <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    Aplicar filtro por:
  </a>
</p>  
  <div class="collapse" id="collapseExample">
  <div class="card card-body">
    <button type="button" class="btn btn-interno btn-collapse btn-mayorMenor">Nota mayor a menor</button>
    <button type="button" class="btn btn-interno btn-collapse btn-menorMayor">Nota menor a mayor</button>
    <button type="button" class="btn btn-interno btn-collapse btn-aprobados">Aprobados</button>
    <button type="button" class="btn btn-interno btn-collapse btn-desaprobados">Desaprobados</button>
    <button type="button" class="btn btn-interno btn-collapse btn-alfabeto">Alfabeticamente</button>
  </div>
</div>
`

document.body.append(contenedorBotones);




// Creación contenedor lista

let contenedorLista = document.createElement("div")
contenedorLista.id= "contenedorLista";
contenedorLista.style.display = "none";

contenedorLista.innerHTML = `
<ul id="listaAlumnos"></ul>
<p id="mensajeCargando" style="display: none;">Cargando...</p>
<p id="p-lista"> Aún no hay alumnos, por favor ingresar. </p>
<p id="emptyAprobados" style="display: none;">No hay alumnos aprobados.</p>
<p id="emptyDesaprobados" style="display: none;">No hay alumnos desaprobados.</p>
`

document.body.append(contenedorLista)

const botonMostrar = document.querySelector(".btn-mostrar");
botonMostrar.addEventListener("click", mostrarListaDeAlumnos);




// Constante y función para mostrar el array listaDeAlumnos en una lista



function mostrarListaDeAlumnos() {

    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divOculto = document.getElementById("contenedorLista");

    divOculto.style.display = "block";

    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";

    document.getElementById("p-lista").style.display = "none";
    document.getElementById("emptyDesaprobados").style.display = "none";
    document.getElementById("emptyAprobados").style.display = "none";

    listaAlumnosUl.innerHTML = "";

    if (listaDeAlumnos.length === 0 ) {
        
        setTimeout(()=> {
            mensajeCargando.style.display = "none";
        }, 600);

        setTimeout(()=> {
            document.getElementById("p-lista").style.display = "block";
        }, 600);
        
        return; 
    }else// Recorre el array listaDeAlumnos y crea elementos <li> para cada alumno
    (setTimeout(() =>  {
        mensajeCargando.style.display = "none";

        listaDeAlumnos.forEach((alumno, idx) => {
            const li = document.createElement("li");
            const botonEliminar = document.createElement("button");
            botonEliminar.innerText = "Eliminar";
            botonEliminar.addEventListener("click", () =>  eliminarAlumno(idx));
            li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} `;
            li.appendChild(botonEliminar);
            listaAlumnosUl.appendChild(li);
    })}, 600))
}


// Función para mostrar la lista pero de mayor a menor nota

function mostrarListaDeAlumnosOrdenada() {

    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divAbierto = document.getElementById("contenedorLista");

    divAbierto.style.display ="block";

    mensajeCargando.style.display = "block";
    
    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";

    // Recorre el array listaDeAlumnos y crea elementos <li> para cada alumno
    if (listaDeAlumnos.length === 0 ) {
        document.getElementById("p-lista").style.display = "none";

        setTimeout(()=> {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";
        }, 600);

        
        return;
    }else{
        document.getElementById("p-lista").style.display = "none";
        setTimeout(() => {
        listaDeAlumnos.forEach((alumno, idx) => {
            

            mensajeCargando.style.display = "none";

            const li = document.createElement("li");
            

            li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
            listaAlumnosUl.appendChild(li);
        })},600)}
    
}


// Función para filtrar alumnos 

const mostrarAlumnosFiltrados = (alumnosFiltrados) => {
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");

    const divAbierto = document.getElementById("contenedorLista");

    document.getElementById("p-lista").style.display = "none";

    divAbierto.style.display ="block";
    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";


    // Recorre el array de alumnos filtrados y crea elementos <li> para cada alumno

    if (listaDeAlumnos.length === 0 ) {
        setTimeout(()=> {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";

        }, 600);
        
        
        return;
    }else{
        setTimeout(()=> {
        alumnosFiltrados.forEach((alumno, idx) => {


            mensajeCargando.style.display = "none";
             

            const li = document.createElement("li");
            li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
            listaAlumnosUl.appendChild(li);
        });}, 600);
    }
    
    
}




// Función para ocultar la lista

const ocultarLista = () => {
    document.getElementById("contenedorLista").style.display = "none";
}

const botonOcultar = document.querySelector(".btn-ocultar");
botonOcultar.addEventListener("click", ocultarLista);


// Función para ordenar de mayor a menor nota 

const mayorParaMenor = () => {
    listaDeAlumnos.sort((a, b) => b.nota - a.nota);

    ocultarMensajes();
    mostrarListaDeAlumnosOrdenada();

}

// Funcion para ordenar de menor a mayor nota

const menorParaMayor = () => {
    listaDeAlumnos.sort((a, b) => a.nota - b.nota);

    ocultarMensajes();
    mostrarListaDeAlumnosOrdenada();

}

// Función para mostrar aprobados

const aprobados = () => {
    const aprobados = listaDeAlumnos.filter(alumno => alumno.aprobado);

    ocultarMensajes();


    if (aprobados.length === 0 && listaDeAlumnos.length > 0) {
        document.getElementById("emptyAprobados").style.display = "none";
        setTimeout(()=> {
            document.getElementById("mensajeCargando").style.display = "none";
            document.getElementById("emptyAprobados").style.display = "block";
        }, 600);
        document.getElementById("emptyDesaprobados").style.display = "none"; 
    } else {
        document.getElementById("emptyAprobados").style.display = "none";
    }

    mostrarAlumnosFiltrados(aprobados);
}


// Función para mostrar desaprobados

const desaprobados = () => {
    ocultarMensajes();

    const desaprobados = listaDeAlumnos.filter(alumno => !alumno.aprobado);

    if (desaprobados.length === 0 && listaDeAlumnos.length > 0) {
        
        setTimeout(()=> {
            document.getElementById("mensajeCargando").style.display = "none";
            document.getElementById("emptyDesaprobados").style.display = "block";
        }, 600);

        
        document.getElementById("emptyAprobados").style.display = "none";
    } else {
        document.getElementById("emptyDesaprobados").style.display = "none";
    }

    mostrarAlumnosFiltrados(desaprobados);
}



// Función para ocultar mensajes 

const ocultarMensajes = () => {
    document.getElementById("emptyAprobados").style.display = "none";
    document.getElementById("emptyDesaprobados").style.display = "none";
}


// Función para ordenar alfabeticamente

const ordenarAlfabeto = () => {
    listaDeAlumnos.sort((a, b) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();

        return nombreA < nombreB ? -1 : nombreA > nombreB ? 1 : 0;

        
    })

    ocultarMensajes();
    mayorParaMenor();
}

// Función para eliminar alumno


const eliminarAlumno = (idx) => {
    listaDeAlumnos.splice(idx, 1);
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos))


    mostrarListaDeAlumnos();
}


// Botón para filtrar de mayor a menor nota

const botonMayorParaMenor = document.querySelector(".btn-mayorMenor");
botonMayorParaMenor.addEventListener("click", mayorParaMenor);


// Botón para filtrar de menor a mayor nota

const botonMenorParaMayor = document.querySelector(".btn-menorMayor");
botonMenorParaMayor.addEventListener("click", menorParaMayor);

// Botón para filtrar por aprobados

const botonAprobados = document.querySelector(".btn-aprobados");
botonAprobados.addEventListener("click", aprobados);

// Botón para filtrar desaprobados

const botonDesaprobados = document.querySelector(".btn-desaprobados");
botonDesaprobados.addEventListener("click", desaprobados);

// Botón para filtrar por orden alfabético

const botonAlfabeto = document.querySelector(".btn-alfabeto");
botonAlfabeto.addEventListener("click", ordenarAlfabeto);































