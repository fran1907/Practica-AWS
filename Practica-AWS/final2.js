//Defino variables para cada elemento HTML que voy a utilizar en el código
const input = document.getElementById('videoFileInput');
const reproductor = document.getElementById('videoCharge');
const lista = document.getElementById('lista');
var boton_play = document.getElementById('play')
var boton_pausa = document.getElementById('pausa')
var anterior = document.getElementById('anterior');
var siguiente = document.getElementById('siguiente');
const vol_up = document.getElementById('subirsonido');
const vol_down = document.getElementById('bajarsonido');
const añadir = document.getElementById('add-button');
const eliminarCancionBotones = document.querySelectorAll('.eliminar-cancion');
let videoFiles = [];// variables para mantener un registro de los archivos de video que se han cargado, 
let current = 0;    // contador para hacer un seguimiento del archivo de video que se está reproduciendo actualmente.

//Al pulsar el boton de iniciar se inicia el video
boton_play.addEventListener("click", function () {
  reproductor.play();
});
//Al pulsar el boton de pausar se para el video
boton_pausa.addEventListener("click", function () {
  reproductor.pause();
});
//Al pulsar el boton de anterior reproduce el video anterior
anterior.addEventListener("click", function () {
  current = (current - 1 + videoFiles.length) % videoFiles.length;
  reproductor.src = videoFiles[current].src;
  reproductor.play();
});
//Al pulsar el boton de siguiente reproduce el video siguiente
siguiente.addEventListener("click", function () {
  current = (current + 1) % videoFiles.length;
  reproductor.src = videoFiles[current].src;
  reproductor.play();
});
//Subir volumen
vol_up.addEventListener("click", function () {
  if (reproductor.volume < 1) {
    reproductor.volume += 0.1;
  }
});
//Bajar volumen
vol_down.addEventListener("click", function () {
  if (reproductor.volume > 0) {
    reproductor.volume -= 0.1;
  }
});

// Cuando se carga un archivo de video en el input de la página, se actualiza la lista de archivos 
// de video y se muestra en la página. Para cada archivo de video cargado, se crea un elemento de lista HTML y se añade a la lista 
// en la página. Si se hace clic en un elemento de lista, se cambia el archivo de video que se está reproduciendo actualmente a ese 
// archivo de video y se inicia la reproducción.
input.addEventListener('change', (event) => {
  //Utilizo el método Array.from() para convertir la lista de archivos seleccionados en un array de objetos. Luego se utiliza el método
  //map() para crear un nuevo array de objetos que contienen el nombre y la URL de cada archivo seleccionado.
  videoFiles = Array.from(event.target.files).map((file) => {
    return {
      name: file.name,
      src: URL.createObjectURL(file)
    };
  });
  //el array de objetos y crear un nuevo elemento li para cada objeto. Cada elemento li se agrega a la lista de reproducción y se le añade 
  //un evento click que cambia el archivo de video que se está reproduciendo en el reproductor y lo reproduce.
  videoFiles.forEach((video) => {
    const li = document.createElement('li');
    li.textContent = video.name;
    li.addEventListener('click', () => {
      reproductor.src = video.src;
      reproductor.play();
      document.getElementById("nombre").innerHTML = video.name;
    });
    lista.appendChild(li);
  });
});


//Funciona mal
añadir.addEventListener("click", function () {
  const file = input.files[0];
  const url = URL.createObjectURL(file);
  videoFiles.push(url);
  const li = document.createElement('li');
  li.textContent = file.name;
  li.addEventListener('click', () => {
    current = videoFiles.indexOf(url);
    reproductor.src = url;
    reproductor.play();
  });
  lista.appendChild(li);
});

//Metodo para eliminar videos
eliminar.addEventListener("click", function () {
  //compruebo que hay canciones en la lista.
  if (videoFiles.length > 0) {
    //Si hay canciones elimino el video actual del array utilizando el método splice().
    videoFiles.splice(current, 1);//El método splice() recibe dos parámetros: el índice desde el que se quiere empezar 
    //a eliminar elementos y el número de elementos a eliminar.
    lista.removeChild(lista.childNodes[current]);//Este método elimina un nodo hijo del elemento especificado.
    //Actualizo la variable current para que reproduzca la siguiente cancion usando el operador modulo
    current = current % videoFiles.length;
    //Compruebo de nuevo si hay canciones en el array
    if (videoFiles.length > 0) {
      //Establece la cancion del reproductor a la cancion actualizada y la reproduce
      reproductor.src = videoFiles[current];
      reproductor.play();
    } else {//Si no hay canciones establecemos al reproductor una cadena vacia para que se detenga la reproduccion
      reproductor.src = "";
    }
  }
});

//Funcion para que cuando termine un video se reproduzca automaticamente el siguiente
function nextVideo() {
  const sigpos = (current + 1) % videoFiles.length;
  const sigvid = videoFiles[sigpos];
  reproductor.src = sigvid.src;
  reproductor.play();

}
reproductor.addEventListener("ended", nextVideo);