async function hidepreload(){
    await new Promise(r => setTimeout(r, 1000));
    preloadImage();
    const preload = document.querySelectorAll('.preloader')[0]; 
    preload.style.opacity = "0"
    await new Promise(r => setTimeout(r, 500));
    preload.style.display = 'none'
    aboutobservers();
}
let observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.toggle("show", entry.isIntersecting)
        } else {
        }
        });
    },
    { threshold: .5 }
);

function aboutobservers(){
    const about = document.querySelectorAll('.aboutusd');
    const serv = document.querySelectorAll('.servdiv');
    const cont = document.querySelectorAll('.contactsdiv');
    about.forEach(it=>{observer.observe(it)});
    serv.forEach(it=>{observer.observe(it)});
    cont.forEach(it=>{observer.observe(it)});

}

async function mobilemenu(){
    const menu = document.querySelectorAll('.mobilemen')[0];
    const mask = document.querySelectorAll('.mask')[0];
    if(menu.offsetWidth == 0){
        mask.style.display = "block"
        menu.style.width = '60%';
        menu.style.paddingLeft = '5%';
        await new Promise(r => setTimeout(r, 50));
        mask.style.opacity = 1;
        //console.log("Otworzono menu, szerokosc: 400px");
    }
    else{
        menu.style.width = 0;
        menu.style.paddingLeft = 0;
        mask.opacity = 0;
        mask.style.opacity = 0;
        await new Promise(r => setTimeout(r, 500));
        mask.style.display = "none"
        //console.log("Zamknieto menu, szerokosc: 0px");
    }
}







var nav = document.getElementsByTagName('nav')[0];
var logo = document.querySelectorAll('.logomain')[0]; 
window.onscroll = function () {
    var scroll = window.scrollY;
    if (scroll != 0) {
        nav.style.padding = "4vh 10vw"
        nav.style.paddingLeft = "20vw"
        nav.style.backgroundColor = "#000000EF";
        nav.style.boxShadow = "0px 6px 6px #000"
        if(window.innerWidth > 992){
            logo.style.left = "calc(10vw - 70px)"
            logo.style.height = "10vh"
            logo.style.top = "1.5vh"
            logo.style.border = "1px solid #60482354"
        }
        else{logo.style.opacity = 1}
    }
    else{
        nav.style.boxShadow = "none"
        nav.style.padding = "70px 10vw"
        nav.style.backgroundColor = "transparent";
        if(window.innerWidth > 992){
            logo.style.left = "69vw"
            logo.style.height = "32vh"
            logo.style.top = "36vh"
            logo.style.border = "none"
        }
        else{logo.style.opacity = 0}
    }
}

function preloadImage()
{
    const urls = ["pictures/bgmain.jpg","pictures/bg2.jpg", "pictures/bg3.jpg", "pictures/bg4.jpg", "pictures/product1.jpg", "pictures/product2.jpg"]
    var imgsarr = new Array();
    
    var i=0;
    urls.forEach(it=>{
        imgsarr[i] = new Image();
        imgsarr[i].src = it;
        i++;
    })
}

function glowna(){
    window.scrollTo({
        top:0,
        left:0, 
        behavior: 'smooth'
    });
}
function onas(){
    window.scrollTo({
        top:window.innerHeight,
        left:0, 
        behavior: 'smooth'
    });
}
function uslugi(){
    window.scrollTo({
        top:window.innerHeight*2,
        left:0, 
        behavior: 'smooth'
    });
}
function kontakt(){
    window.scrollTo({
        top:window.innerHeight*3,
        left:0, 
        behavior: 'smooth'
    });
}

//SCROLL DO MOBILNEJ
function glownamobile(){
    const sekcja = document.getElementById('p1');
    sekcja.scrollIntoView({behavior:"smooth"});
    hidemenu();
}
function onasmobile(){
    const sekcja = document.getElementById('p2');
    sekcja.scrollIntoView({behavior:"smooth"});
    hidemenu();
}
function uslugimobile(){
    const sekcja = document.getElementById('p3');
    sekcja.scrollIntoView({behavior:"smooth"});
    hidemenu();
}
function kontaktmobile(){
    const sekcja = document.getElementById('p4');
    sekcja.scrollIntoView({behavior:"smooth"});
    hidemenu();
}

async function hidemenu(){
    const menu = document.querySelectorAll('.mobilemen')[0];
    const mask = document.querySelectorAll('.mask')[0];
    menu.style.width = 0;
    menu.style.paddingLeft = 0;
    mask.style.opacity = 0;
    await new Promise(r => setTimeout(r, 500));
    mask.style.display = "none"
}

function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}