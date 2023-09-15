const listaDeAlumnos = [];

class Alumno {
    constructor(nombreAlumno, apellidoAlumno, notaAlumno) {
        this.nombre = nombreAlumno;
        this.apellido = apellidoAlumno;
        this.nota = notaAlumno;
        this.aprobado = notaAlumno > 6;
    }
}

function validarFormulario(e) {
    e.preventDefault();
    console.log("Formulario Enviado");

    document.getElementById("mensajeError").style.display = "none";

    e.target.reset();
}

function funcionAgregarAlumno() {
    let nombre = document.getElementById("nombreInput").value;
    let apellido = document.getElementById("apellido").value;
    let nota = parseInt(document.getElementById("nota").value);

    if (!nombre || !apellido || isNaN(nota)) {
        document.getElementById("mensajeError").style.display = "block";
        return;
    }

    let nuevoAlumno = new Alumno(nombre, apellido, nota);

    listaDeAlumnos.push(nuevoAlumno);

    document.getElementById("nombreInput").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("nota").value = "";

    console.log(listaDeAlumnos);
}

let contenedorDatos = document.createElement("div");
contenedorDatos.id = "contenedorDatos"

contenedorDatos.innerHTML = `
<h2> Bienvenido a nuestro sistema de alumnos </h2>

<form id="form-test">
<input type="text" id="nombreInput" placeholder="Ingresar nombre..." />
<input type="text" id="apellido" placeholder="Ingresar apellido..." />
<input type="number" id="nota" placeholder="ingresar nota..." />
<input type="button" id="enviarDatos" value="Enviar Datos" />
</form>
<p id="mensajeError">Por favor, complete todos los campos.</p>`;

document.body.append(contenedorDatos);

let botonEnviarDatos = document.getElementById("enviarDatos");
botonEnviarDatos.addEventListener("click", funcionAgregarAlumno);

let formulario = document.getElementById("form-test");
formulario.addEventListener("reset", validarFormulario)


























