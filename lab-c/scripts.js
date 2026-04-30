console.debug("Hello world!");



let map = L.map('map').setView([53.43, 14.56], 15);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);


document.getElementById("saveButton").addEventListener("click", function() {
  let table = document.getElementById("puzzleTable");
  const puzzles = [];

  for (let i = 0; i < 16; i++) {
    let container = document.createElement("div");
    container.classList.add("puzzle-container");

    let puzzle = document.createElement("canvas");
    puzzle.classList.add("puzzle");
    puzzle.id = "puzzle" + i;
    puzzle.draggable = true;

    puzzle.width = 150;
    puzzle.height = 75;


    puzzle.addEventListener("dragstart", function(event) {
      event.dataTransfer.setData("text", this.id);
    });

    container.appendChild(puzzle);
    puzzles.push(container);
  }

  //rozwiazanie ze strony geeksforgeeks
  puzzles.sort(() => Math.random() - 0.5);

  puzzles.forEach(container => {
    table.appendChild(container);
  })

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      leafletImage(map, function (err, canvas) {

        let rm = document.getElementById("rasterCopy");
        let rc = rm.getContext("2d");
        rc.drawImage(canvas, 0,0);



        const index = i*4+j;
        let rasterMap = document.getElementById("puzzle" + index);
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 150 * j, 75 * i, 150, 75, 0,0,150,75);
      })
    }
  }
  let drag = document.getElementById("dragTable");

  for (let i = 0; i < 16; i++) {
    let dropOff = document.createElement("div");
    dropOff.classList.add("puzzle-container", "drop-zone");
    dropOff.dataset.targetID = "puzzle" + i;
    drag.appendChild(dropOff);

    dropOff.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    dropOff.addEventListener("drop", function (event) {
      event.preventDefault();
      let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
      if (this.querySelector('.puzzle')) {
        return;
      }
      this.appendChild(myElement);

      if (this.dataset.targetID === event.dataTransfer.getData('text')) {
        myElement.classList.add("correct");
        myElement.style.height = myElement.style.width = 100 + "%";
        myElement.style.margin = 0;
        this.style.border = "none";
        console.log(document.querySelectorAll(".correct").length);
        if (document.querySelectorAll(".correct").length === 16) {
          setTimeout(() => {
            if (!("Notification" in window)) {
              alert("This browser does not support desktop notification");
            } else if (Notification.permission === "granted") {
              new Notification("Brawo, rozwiazales puzzle");
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("Brawo, rozwiazales puzzle");
                }
              });
            }
          }, 100);
        }

      } else {
        myElement.classList.remove("correct");
        myElement.style.height = myElement.style.width = "calc(100% - 10px)";
        myElement.style.margin = 5 + "px";
      }
    }, false);
  }
});

document.getElementById("getLocation").addEventListener("click", function() {
  if (! navigator.geolocation) {
    console.log("No geolocation available.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    map.setView([lat, lng]);

  }, positionError => {
    console.error(positionError);
  })
});


let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
  target.addEventListener("dragenter", function () {
    this.style.border = "2px solid #7FE9D9";
  });
  target.addEventListener("dragleave", function () {
    this.style.border = "2px dashed #7f7fe9";
  });

}

