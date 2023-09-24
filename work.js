// Función encontrada en StackOverflow para quitar caracteres especiales y podes validar correctamente

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


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

    // Variables para el constructor obtenidas de los inputs
    let nombre = removeAccents(document.getElementById("nombreInput").value.trim());
    let apellido = removeAccents(document.getElementById("apellido").value.trim());
    let nota = parseInt(document.getElementById("nota").value.trim());


    // Manejo de errores de los datos ingresados
    if (!nombre || !isNaN(nombre) || !apellido || !isNaN(apellido) || isNaN(nota) || nota < 1 || nota > 10) {
        Toastify({
            text: "Por favor, complete todos los campos. Notas de 1 a 10 únicamente.",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ff0000",
            }
        }).showToast();
        return;
    }
    if (alumnoExistente(nombre, apellido)) {
        Toastify({
            text: "El alumno ya existe en la base de datos.",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ffff00",
                color: "#000000",
            }
        }).showToast();

        return;
    }






    // Finalización clase constructora
    let nuevoAlumno = new Alumno(nombre, apellido, nota);


    // Pusheo al array con el proceso JSON
    listaDeAlumnos.push(nuevoAlumno);
    Toastify({
        text: "Alumno agregado.",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#008000",
        }
    }).showToast();
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos));


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
</form>`;

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
<div><input id="inputSearch" type="search" placeholder="Ingrese el nombre del alumno a buscar..."/></div>`

document.body.append(contenedorBotones);




// Creación contenedor lista

let contenedorLista = document.createElement("div")
contenedorLista.id = "contenedorLista";
contenedorLista.style.display = "none";

contenedorLista.innerHTML = `
<ul id="listaAlumnos"></ul>
<div class="loader" id="mensajeCargando" style= "display:none;"></div>
<p id="p-lista"> Aún no hay alumnos, por favor ingresar. </p>
<p id="emptyAprobados" style="display: none;">No hay alumnos aprobados.</p>
<p id="emptyDesaprobados" style="display: none;">No hay alumnos desaprobados.</p>
<p id="sinCoincidencias" style="display:none;">No se encontraron coincidencias</p>
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

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";
    document.getElementById("emptyDesaprobados").style.display = "none";
    document.getElementById("emptyAprobados").style.display = "none";



    if (listaDeAlumnos.length === 0) {

        setTimeout(() => {
            mensajeCargando.style.display = "none";
        }, 600);

        setTimeout(() => {
            document.getElementById("p-lista").style.display = "block";
        }, 600);

        return;
    } else// Recorre el array listaDeAlumnos y crea elementos <li> para cada alumno
        (setTimeout(() => {
            mensajeCargando.style.display = "none";

            listaDeAlumnos.forEach((alumno, idx) => {
                const li = document.createElement("li");
                const botonEliminar = document.createElement("button");
                botonEliminar.innerText = "Eliminar";
                botonEliminar.addEventListener("click", () => sweetAlertEliminar(idx));
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} `;
                li.appendChild(botonEliminar);
                listaAlumnosUl.appendChild(li);
            })
        }, 600))
}


// Función para mostrar la lista pero de mayor a menor nota

function mostrarListaDeAlumnosOrdenada() {

    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divAbierto = document.getElementById("contenedorLista");

    divAbierto.style.display = "block";

    mensajeCargando.style.display = "block";

    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";

    // Recorre el array listaDeAlumnos y crea elementos <li> para cada alumno
    if (listaDeAlumnos.length === 0) {
        document.getElementById("p-lista").style.display = "none";

        setTimeout(() => {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";
        }, 600);


        return;
    } else {
        document.getElementById("p-lista").style.display = "none";
        setTimeout(() => {
            listaDeAlumnos.forEach((alumno, idx) => {


                mensajeCargando.style.display = "none";

                const li = document.createElement("li");

                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
                listaAlumnosUl.appendChild(li);
            })
        }, 600)
    }

    listaAlumnosUl.innerHTML = "";
}


// Función para filtrar alumnos 

const mostrarAlumnosFiltrados = (alumnosFiltrados) => {
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");

    const divAbierto = document.getElementById("contenedorLista");

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";

    divAbierto.style.display = "block";
    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";




    // Recorre el array de alumnos filtrados y crea elementos <li> para cada alumno

    if (listaDeAlumnos.length === 0) {
        setTimeout(() => {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";

        }, 600);


        return;
    } else {
        setTimeout(() => {
            alumnosFiltrados.sort((a, b) => b.nota - a.nota);
            alumnosFiltrados.forEach((alumno, idx) => {

                mensajeCargando.style.display = "none";

                const li = document.createElement("li");
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
                listaAlumnosUl.appendChild(li);

            });
        }, 600);
    }


}



// Función para buscar alumnos por nombre y apellido 
let timeoutId;

const busqueda = () => {
    clearTimeout(timeoutId);

    const buscarInput = document.getElementById("inputSearch").value.toUpperCase();
    const listaAlumnosUl = document.getElementById("listaAlumnos");

    listaAlumnosUl.innerHTML = "";

    if (buscarInput === "") {
        mostrarListaDeAlumnosOrdenada();
    } else {
        timeoutId = setTimeout(() => {
            const resultados = listaDeAlumnos.filter(alumno => {
                document.getElementById("sinCoincidencias").style.display = "none";
                const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toUpperCase();
                return nombreCompleto.includes(buscarInput);
            });
            mostrarAlumnosFiltrados(resultados);
        }, 300);
    }
}

const inputSearch = document.getElementById("inputSearch");
inputSearch.addEventListener("input", busqueda);


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
        setTimeout(() => {
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

        setTimeout(() => {
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
    mostrarListaDeAlumnosOrdenada();
}

// Función para eliminar alumno


const eliminarAlumno = (idx) => {
    listaDeAlumnos.splice(idx, 1);
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos))

    mostrarListaDeAlumnos();
}

// Función para editar nota 




// Funcion sweet alert eliminar alumno

const sweetAlertEliminar = (idx) => {
    Swal.fire({
        text: 'Estas seguro? Vas a eliminar un alumno',
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarAlumno(idx);
            Toastify({
                text: "Alumno eliminado.",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#ff0000",
                }
            }).showToast();
        } else if (result.isDenied) {
            Swal.fire({
                text: 'No se eliminará el alumno',
            })
        }
    })
}




// Fetch

if (listaDeAlumnos.length === 0) {
    fetch('api.json')
        .then(response => response.json())
        .then(response => {
            listaDeAlumnos.push(...response)
        })
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































