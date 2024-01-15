function observers(){
    const images = document.querySelectorAll('.productspic');
    const texts = document.querySelectorAll('.productstext');
    const nagl = document.querySelectorAll('.nagl');
    const naglcont = document.querySelectorAll('.contactshead')
    const contacts = document.querySelectorAll('.contacts');
    let observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.toggle("show", entry.isIntersecting)
            entry.target.classList.toggle("shadow", entry.isIntersecting)
        } else {
        }
        });
    },
    { threshold: .3 }
    );

    images.forEach(it=>{observer.observe(it)});
    texts.forEach(it=>{observer.observe(it)});
    nagl.forEach(it=>{observer.observe(it)});
    naglcont.forEach(it=>{observer.observe(it)});
    contacts.forEach(it=>{observer.observe(it)});
}

var nav = document.getElementsByTagName('nav')[0];
window.onscroll = function (event) {
    var scroll = window.scrollY;
    if (scroll != 0) {
        nav.style.backgroundColor = '#000000d8';
    }
    else{
        nav.style.backgroundColor = 'transparent';
    }
}

async function lighten(){
    const preload = document.getElementById("loader");
    preload.style.opacity = 0;
    const mainw = document.getElementById("mainw");
    mainw.style.display= "grid";
    mainw.style.animation = "leftSlide .6s ease";
    await new Promise(r => setTimeout(r, 600));
    preload.style.display = 'none';
    const a1 = document.getElementById("about1");
    const a2 = document.getElementById("about2");
    const a3 = document.getElementById("about3");
    observers();
    if(window.scrollY < 1000){
        while(true){ 
            a1.style.color = 'white';
            await new Promise(r => setTimeout(r, 2000));
            a1.style.color = '#2e2d2d';
            a2.style.color = 'white';
            await new Promise(r => setTimeout(r, 2000));
            a2.style.color = '#2e2d2d';
            a3.style.color = 'white';
            await new Promise(r => setTimeout(r, 2000));
            a3.style.color = '#2e2d2d';
        }
    }
    
}

function glowna(){
    window.scrollTo({
        top:0,
        left:0, 
        behavior: 'smooth'
    });
}
function poznaj(){
    window.scrollTo({
        top:document.querySelectorAll('.products')[0].offsetTop - 150,
        left:0, 
        behavior: 'smooth'
    });
}
function kontakt(){
    window.scrollTo({
        top: document.querySelectorAll('.contactshead')[0].offsetTop - 150,
        left:0, 
        behavior: 'smooth'
    });
}
