document.querySelector("#pobierz").addEventListener("click", function() {
  let miasto = document.querySelector("#miasto");
  const dzisiaj = new Date().toLocaleDateString("pl-PL");
  const dzisiejsze = document.getElementById("dzisiaj");
  let req = new XMLHttpRequest();

  req.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${miasto.value}&appid=ef1ebf3ae83ab9acb9c52e0883a05cd0&units=metric&lang=pl`);
  req.addEventListener("load", function(event) {
    let data = JSON.parse(event.target.responseText);
    console.log(data);
    const loczekBloczek = bloczek(data);
    loczekBloczek.classList.remove("blok-pogodowy");
    loczekBloczek.classList.add("pogoda-dzisiaj");
    dzisiejsze.innerHTML = "";
    dzisiejsze.appendChild(loczekBloczek);
  })
  req.send(null);
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${miasto.value}&appid=ef1ebf3ae83ab9acb9c52e0883a05cd0&units=metric&lang=pl`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      if(data.cod != 200 ) {
        miasto.style.backgroundColor = "#ff000050";
      } else {
        miasto.style.backgroundColor = "";
        let pogody = document.getElementById("pogody");
        pogody.innerHTML = "";
        for (const pogodyElement of data.list) {
          const dzien = new Date(pogodyElement.dt * 1000).toLocaleDateString("pl-PL");
          if (dzisiaj === dzien) {
            const loczekBloczek = bloczek(pogodyElement);
            loczekBloczek.classList.remove("blok-pogodowy");
            loczekBloczek.classList.add("pogoda-dzisiaj");
            dzisiejsze.appendChild(loczekBloczek);
          } else {
            pogody.appendChild(bloczek(pogodyElement));
          }
        }

      }

    })
})

function bloczek(dane) {
  let bloczek = document.createElement("div");
  bloczek.classList.add("blok-pogodowy");

  let czas = new Date(dane.dt * 1000).toLocaleString("pl-PL");
  let data = document.createElement("p");
  data.classList.add("data");
  data.innerText = czas;
  bloczek.appendChild(data);

  let danePogodowe = document.createElement("div");
  danePogodowe.classList.add("dane-pogodowe");

  let temperatura = document.createElement("div");
  temperatura.classList.add("temperatura");

  let tempText = document.createElement("span");
  tempText.innerHTML = Math.round(dane.main.temp) + "°C";
  tempText.classList.add("temp-glowna");
  temperatura.appendChild(tempText);


  danePogodowe.appendChild(temperatura);

  let warunki = document.createElement("div");
  warunki.classList.add("warunki");

  let warunkiText = document.createElement("span");
  warunkiText.innerHTML = dane.weather[0].description;
  warunki.appendChild(warunkiText);

  danePogodowe.appendChild(warunki);

  bloczek.appendChild(danePogodowe);

  return bloczek;
}
