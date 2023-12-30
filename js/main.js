async function hidePreloader(){
    let preloader = document.querySelector('.preloader')
    await new Promise(r => setTimeout(r, 2000)) 
    preloader.style.top = "-100%"
    pokazSzablon(szablonIndex);
}



//OPEN MATURA
function openMatura(){
    window.open("https://www.matura365.pl", "_blank")
}


//ZAKLADKI
function mojeProjekty() {document.querySelectorAll('.main-grid-area')[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});}
function mojeSzablony() {document.querySelectorAll('.main-grid-area')[1].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});}
function kontakt() {document.querySelectorAll('.main-grid-area')[2].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});}
function oMnie() {document.querySelectorAll('.main-grid-area')[3].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});}

//SZABLONY ZMIANA
var szablonIndex = 1;


function plusDivs(n) {
  pokazSzablon(szablonIndex += n);
}

function pokazSzablon(n) {
    let img = document.getElementById("szablony-screen-img");
    let title = document.getElementById("szablony-info-title");
    let desc = document.getElementById("szablony-info-desc");
    let dalej = document.getElementById("szablony-przycisk-prawo");
    let wstecz = document.getElementById("szablony-przycisk-lewo");
    let zobacz = document.getElementById("szablony-info-przycisk");
    img.src = `/imgs/szablon${n}.png`
    title.innerHTML = `&gt; Szablon #${n}`
    zobacz.onclick = function() {location.href = `szablon${n}.html`}

    if(n == 1){
        wstecz.style.opacity = "0%";
        wstecz.disabled=true;
    }
    if(n == 2){
        wstecz.style.opacity="100%";
        wstecz.disabled=false;
    }
    if(n == 3){
        dalej.style.opacity = "100%";
        dalej.disabled=false;
    }
    if(n == 4){
        dalej.style.opacity="0%";
        dalej.disabled=true;
    }
    
    
    
    

    switch (n){
        case 1:
            desc.innerHTML = "To jest przykładowy opis szablonu 1.";
            break;
        case 2:
            desc.innerHTML = "To jest przykładowy opis szablonu 2.";
            break;
        case 3:
            desc.innerHTML = "To jest przykładowy opis szablonu 3.";
            break;
        case 4:
            desc.innerHTML = "To jest przykładowy opis szablonu 4.";
            break;
    }
}