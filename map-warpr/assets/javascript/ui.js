const bootScreen = document.querySelectorAll(".boot-screen");
const fastBoot = document.getElementById("js-fast-boot");
const consoleText = document.getElementById("console");
const effectsContainer = document.querySelectorAll(".app");
const appContainer = document.querySelectorAll(".app-container");
const whiteCircle = document.querySelectorAll(".white-circle");
const greenCircle = document.querySelectorAll(".white-circle");
const docfrag = document.createDocumentFragment();
const overallLoadTime = 7000;
const duration = 2000;
const numberOfEls = 50;

/*
 * Dash Array function
*/
function createDashArray() {
  const dashPattern = document.querySelectorAll(".dash-pattern"); 

  function createDashes(i, element) {
    let dash = document.createElement("div");
    const positionX = (100 / numberOfEls) * i;
    dash.classList.add("dash");
    dash.style.left = positionX + "%";
    dash.style.animationDelay = -1 + (2 / numberOfEls) * (i) + "s";
    element.appendChild(dash);
  };

  dashPattern.forEach(function(element) {
    for (let i = 0; i < numberOfEls; i++) createDashes(i, element);
  });
  
  return;
}

/*
 * Helix function
*/
function createHelix() {
  const helix = document.querySelector(".helix");
  var countup = true;

  function createStrand(i) {
    let strand = document.createElement("div");
    const opacity = (1 / numberOfEls * i);
    const positionY = (100 / numberOfEls) * i - 50;
    strand.classList.add("strand");
    strand.style.opacity = opacity;
    strand.style.top = positionY + "%";
    strand.style.animationDelay = -5 + (3 / numberOfEls) * i + "s"; 
    helix.appendChild(strand); 
  }; 

  for (let i = 0; i < numberOfEls; i++) createStrand(i); 
  
  return;
}

/* 
 * Perect loading function
*/
function percentLoader(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current + "%";
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
  
  return;
}

function speedUpCircles() {
  /* whiteCircle.forEach(function(el) {
    el.style.animationDuration = "1s";
  }); */
  /* whiteCircle[0].style.animationDuration = "1s";
  for (var i = 15 ; i <= 0; i--) {
    whiteCircle[0].style.animationDuration = i + "s";
  }
   */
  var time = 15;
  setInterval(function() {
    if (time >= 5) {
      time /= 2 ;
    } else {
      time = 1;
    }
    whiteCircle[0].style.animationDuration = time + "s";
  }, 2000);
}
 
//speedUpCircles();

/*
 * Fake booting code
*/
var fakeCode = [
  "SYSTEM STAND BY",
  "BOOTING",
  "USERNAME: ******",
  "PASSWORD: *********",
  "ACCESS DENIED",
  "FORCE: XX0022. ENCYPT://000.222.2345",
  "TRYPASS: ********* AUTH CODE: ALPHA GAMMA: 1___ PRIORITY 1",
  "RETRY: WARP SPEED",
  "Z:> /WARPR/LOCATION/DETECT/ EXECUTE -WARPR SESSION 0",
  "================================================",
  "Priority 1 // local / scanning...",
  "scanning location...",
  "LOCATION FOUND (23.45.23.12.00000000)",
  "LOCATION FOUND (13.66.23.12.00110000)",
  "LOCATION FOUND (13.66.23.12.00110044)",
  "...",
  "...",
  "...",
  "...",
  "...",
  "...",
  "WARP.EXE -r -z",
  "...locating vulnerabilities...",
  "...vulnerabilities found...",
  "MCP/> DEPLOY CLU",
  "SCAN: __ 0100.0000.0554.0080",
  "SCAN: __ 0020.0000.0553.0080",
  "SCAN: __ 0001.0000.0554.0550",
  "SCAN: __ 0012.0000.0553.0030",
  "SCAN: __ 0100.0000.0554.0080",
  "SCAN: __ 0020.0000.0553.0080",
];

function pushFakeCode() {
  //Shuffle the "fakeCode" array
  fakeCode.push(fakeCode.shift());
  //Rebuild document fragment
  fakeCode.forEach(function(e) {
    var p = document.createElement("p");
    p.textContent = e;
    docfrag.appendChild(p);
  });
  //Clear DOM body
  while (consoleText.firstChild) {
    consoleText.removeChild(consoleText.firstChild);
  }
  consoleText.appendChild(docfrag);
}

// Start consoleText code
var runConsole = window.setInterval(pushFakeCode, 200);
// Stop consoleText code after setTimeout
var stopConsole = setTimeout(function() {
  clearInterval(runConsole);
}, overallLoadTime);
// Create Helix animation
createHelix();
// Create Dash array animations
createDashArray();
// Start loading text animation after setTimeout
setTimeout(function(){
  percentLoader("loading", 00, 100, (overallLoadTime - 4000));
}, (overallLoadTime - 3000));

/* 
 End the boot cycle
*/
function endBoot() {
  var newTimerId = window.setInterval("function(){}");
  for (var i = 0 ; i <= newTimerId; i++) {
    window.clearInterval(i); 
  }
  bootScreen[0].classList.add("hide");
  effectsContainer[0].classList.add("screen-jerk");
  setTimeout(function(){
    appContainer[0].classList.add("show");
  }, 500);
  while (bootScreen[0].firstElementChild) {
    bootScreen[0].removeChild(bootScreen[0].firstElementChild);
  };
}

var bootComplete = setTimeout(function(){
    endBoot();
}, overallLoadTime + 100);

/*  
 * Pause the boot cycle
*/
function pauseBoot() {
  var newTimerId = window.setInterval("function(){}");
  for (var i = 0 ; i <= newTimerId; i++) {
    window.clearInterval(i); 
  }
}