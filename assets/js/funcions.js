"use strict"

let jugant = false;
let partidaAcabada = false;
let tempsRestant = 0;
let comptCartes = 0;
let comptPunts = 0;
let comptMoviments = 0;

const tauler = document.getElementById("tauler");

const botoInici = document.getElementById("botoInici");
const botoFi = document.getElementById("botoFi");

const comptElement = document.getElementById("comptador");
const elemMoviment = document.getElementById("moviments");
const elemPuntuacio = document.getElementById("puntuacio");
const topText = document.getElementById("top-text");

const modeFacil = document.getElementById("facil");
const modeNormal = document.getElementById("normal");
const modeDificil = document.getElementById("dificil");
const selectDificultat = document.querySelector('.dificultat');


let cartesDestapades = 0;
let cartesDestapadesArray = [];
let temporitzador;

botoInici.addEventListener("click", (evento) => iniciarJoc(valors)); // escoltador que quan fa clic, passa la funcio
botoFi.addEventListener("click", (evento) => acabaPartida()); // escoltador que quan fa clic, passa la funcio

const valors = [
  "./assets/img/1.jpeg", "./assets/img/1.jpeg",
  "./assets/img/2.jpeg", "./assets/img/2.jpeg",
  "./assets/img/3.jpeg", "./assets/img/3.jpeg",
  "./assets/img/4.jpeg", "./assets/img/4.jpeg",
  "./assets/img/5.jpeg", "./assets/img/5.jpeg",
  "./assets/img/6.jpeg", "./assets/img/6.jpeg",
  "./assets/img/7.jpeg", "./assets/img/7.jpeg",
  "./assets/img/8.jpeg", "./assets/img/8.jpeg",
  "./assets/img/9.jpeg", "./assets/img/9.jpeg",
  "./assets/img/10.jpeg", "./assets/img/10.jpeg",
  "./assets/img/11.jpeg", "./assets/img/11.jpeg",
  "./assets/img/12.jpeg", "./assets/img/12.jpeg"
];


barrejaCartes(valors);
crearCartes(valors);


function iniciarJoc(array) {
  // reiniciem totes les variables possibles
  comptPunts = 0;
  comptMoviments = 0;
  elemMoviment.innerHTML = "Moviments: " + comptMoviments;
  elemPuntuacio.innerHTML = "Puntuació: " + comptPunts;
  topText.innerHTML = "";
  partidaAcabada = false;
  jugant = true;
  const cartes = document.getElementsByClassName("carta"); // agafa les cartes segons la classe

  // crea un array dels elements de cartes i itera sobre l'array creat i elimina cada div
  Array.from(cartes).forEach(carta => {
    carta.remove();
  });

  // iniciar temporitzador i col·locar les cartes aleatoriament
  iniciarComptador(tempsRestant);
  barrejaCartes(array);
  crearCartes(array);
  dificultatJoc(selectDificultat.value)
}

function barrejaCartes(array) { // funció barreja els valors de l'array per col·locarlos aleatòriament
  array.sort(() => Math.random() - 0.5);
}

function crearCartes(array) {
  array.forEach(imatgeCarta => {
    // crea la carta
    let carta = document.createElement("div");
    carta.classList.add("carta");

    // crea la cara de davant (la cara tapada)
    let caraDavant = document.createElement("div");
    caraDavant.classList.add("cara", "cara-davant");

    // crea la imatge de la cara tapada
    let imgDavant = document.createElement("img");
    imgDavant.src = "./assets/img/carta-tapada.jpg";
    // imgDavant.src = imatgeCarta;
    caraDavant.appendChild(imgDavant);

    // crea la cara de darrere (la cara amb les imatges de l'array)
    let caraDarrere = document.createElement("div");
    caraDarrere.classList.add("cara", "cara-darrere");

    // crea la imatge de la cara destapada
    let imgDarrere = document.createElement("img");
    imgDarrere.src = imatgeCarta;
    caraDarrere.appendChild(imgDarrere);

    // afegeix les cares a la carta
    carta.appendChild(caraDavant);
    carta.appendChild(caraDarrere);

    // quan fem click a la carta, cridem a la funcio que gira cadascuna d'elles
    carta.addEventListener("click", giraCarta);
    tauler.appendChild(carta);
  });
}

function giraCarta(event) {
  // quan la partida estigui iniciada i hi hagi menys de dues cartes girades
  if (jugant && cartesDestapades < 2) {
    // crea click_carta com a l'element que hi ha sota el ratoli
    let click_carta = event.target;
    if (!click_carta.classList.contains("carta")) { // si no existeix la classe carta, agafem la més propera
      click_carta = click_carta.closest(".carta");
    }
    if (!click_carta.classList.contains("carta-girada")) { // si no existeix la classe carta-girada, l'afegeix
      click_carta.classList.add("carta-girada");
      cartesDestapades += 1; // suma una carta destapada 
      cartesDestapadesArray.push(click_carta); // afegeix la carta clicada a l'array
    }

    if (cartesDestapades === 2) {
      comptMoviments += 1; // suma un moviment
      elemMoviment.innerHTML = "Moviments: " + comptMoviments;
      setTimeout(() => {
        // agafa les dues primeres cartes de l'array
        const carta1 = cartesDestapadesArray[0];
        const carta2 = cartesDestapadesArray[1];

        if (comprovaParella(carta1, carta2) && jugant) { // comprova que les cartes siguin iguals i que la partida segueixi en funcionament
          comptCartes += 2; // suma dues cartes girades
          comptPunts += 1; // suma un punt
          elemPuntuacio.innerHTML = "Puntuació: " + comptPunts;
          if (comptCartes === 24) { // quan s'hagi fet match amb totes les cartes, acaba la partida
            partidaAcabada = true;
            if (partidaAcabada) {
              topText.innerHTML = "FELICITATS! HAS GUANYAT!!";
              acabaPartida();
              partidaAcabada = false;
              comptCartes = 0;
            }
          }
        } else if (jugant) {
          // si no son iguals, les gira de nou
          carta1.classList.toggle("carta-girada");
          carta2.classList.toggle("carta-girada");
        }

        cartesDestapades = 0;
        cartesDestapadesArray = [];
      }, 1000);
    }
  }
}

function comprovaParella(carta1, carta2) {
  // agafa la imatge de les dues cartes
  const valorCarta1 = carta1.querySelector(".cara-darrere img").src;
  const valorCarta2 = carta2.querySelector(".cara-darrere img").src;

  // verificar si les cartes tenen el mateix valor i no són el mateix element
  return valorCarta1 === valorCarta2 && carta1 !== carta2;
}

function iniciarComptador(tempsInicial) {
  // atura el temporitzador anterior si existeix i reiniciem el temps
  if (temporitzador) {
    tempsRestant = tempsInicial;
    clearInterval(temporitzador);
  }

  // actualitza el comptador cada segon
  temporitzador = setInterval(() => {
    let minuts = Math.floor(tempsRestant / 60);
    let segons = tempsRestant % 60;

    let tempsFormat = minuts.toString().padStart(2, '0') + ':' + segons.toString().padStart(2, '0');

    comptElement.innerHTML = tempsFormat;

    tempsRestant--;

    if (tempsRestant < 0) { // quan el temps s'esgoti, neteja el temporitzador i acaba la partida
      clearInterval(temporitzador);
      partidaAcabada = true;
      if (partidaAcabada) {
        topText.innerHTML = "Temps esgotat! La partida ha finalitzat!";
        acabaPartida();
        partidaAcabada = false;
      }
    }
  }, 1000);
}

function dificultatJoc(dificultat) {
  const cartes = document.getElementsByClassName("carta");

  Array.from(cartes).forEach(carta => {
    carta.classList.remove("carta-girada");
  });

  let tempsMostrar;
  // en funció de la dificultat sel·leccionada, canviem el temps de partida 
  // i el temps que es mostren les cartes al principi de la partida
  if (dificultat === "facil") {
    tempsRestant = 300;
    tempsMostrar = 5000;
  } else if (dificultat === "normal") {
    tempsRestant = 180;
    tempsMostrar = 2000;
  } else if (dificultat === "dificil") {
    tempsRestant = 60;
    tempsMostrar = 500;
  }

  setTimeout(() => {
    Array.from(cartes).forEach(carta => {
      carta.classList.add("carta-girada");
    });

    // despres d'un temps, revertir l'estat de les cartes
    setTimeout(() => {
      Array.from(cartes).forEach(carta => {
        carta.classList.remove("carta-girada");
      });
    }, tempsMostrar);
  }, 0);
}

function acabaPartida() { // funcio que acaba la partida al clicar el botó STOP
  jugant = false;
  clearInterval(temporitzador);
  const cartes = document.querySelectorAll('.carta');
  Array.from(cartes).forEach(carta => { // mostra totes les cartes al finalitzar la partida
    carta.classList.add("carta-girada");
  });
  partidaAcabada = false;
}
