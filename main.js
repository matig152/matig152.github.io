async function hidePreloader(){
    let preloader = document.querySelector('.preloader')
    //await new Promise(r => setTimeout(r, 2000)) 
    preloader.style.top = "-100vh";
    
    let slider = document.querySelectorAll('.content-slider')[0];
    let slider2 = document.querySelectorAll('.content-slider')[1];
    let slides = Array.from(slider.children);
    let slides2 = Array.from(slider2.children);
    slides[0].scrollIntoView({block: 'nearest', inline: 'center' });
    slides2[0].scrollIntoView({block: 'nearest', inline: 'center' });
}

//MOBILE MENU
function closeMenu(){
    let menu = document.getElementById("mobile-nav")
    menu.style.left = "-50%"
}
function openMenu(){
    let menu = document.getElementById("mobile-nav")
    menu.style.left = "0"
}

// PROJEKTY
let slider = document.querySelectorAll('.content-slider')[0];
let slides = Array.from(slider.children);
let index = 0;
let buttonLeft = document.querySelectorAll('.content-button')[0];
let buttonRight = document.querySelectorAll('.content-button')[1];
function moveRight(){
    if(index == 0){buttonLeft.style.opacity = "1";}
    if(index == slides.length - 1){return;}
    index += 1;
    if(index == slides.length - 1){ buttonRight.style.opacity = "0";}
    slides[index].scrollIntoView({block: 'nearest', inline: 'center' });
}
function moveLeft(){
    if(index == 0) {return;}
    if(index == slides.length - 1){buttonRight.style.opacity = "1";}
    index = index - 1;
    if(index == 0){ buttonLeft.style.opacity = "0";}
    slides[index].scrollIntoView({block: 'nearest', inline: 'center' });
}

// SZABLONY
let slider2 = document.querySelectorAll('.content-slider')[1];
let slides2 = Array.from(slider2.children);
let index2 = 0;
let buttonLeft2 = document.querySelectorAll('.content-button')[2];
let buttonRight2 = document.querySelectorAll('.content-button')[3];
function moveRight2(){
    if(index2 == 0){buttonLeft2.style.opacity = "1";}
    if(index2 == slides2.length - 1){return;}
    index2 += 1;
    if(index2 == slides2.length - 1){ buttonRight2.style.opacity = "0";}
    slides2[index2].scrollIntoView({block: 'nearest', inline: 'center' });
}
function moveLeft2(){
    if(index2 == 0) {return;}
    if(index2 == slides2.length - 1){buttonRight2.style.opacity = "1";}
    index2 = index2 - 1;
    if(index2 == 0){ buttonLeft2.style.opacity = "0";}
    slides2[index2].scrollIntoView({block: 'nearest', inline: 'center' });
}



// MAIL
function sendMail(){
    let params = {
        imie: document.getElementById("imie").value,
        mail: document.getElementById("mail").value,
        tresc: document.getElementById("tresc").value
    }
    if(params.imie == "" || params.mail == ""|| params.tresc ==""){
        let sign = document.getElementById('email-sent-sign')
        let h1 = document.getElementById('email-sent-h1')
        let p = document.getElementById('email-sent-p')
        sign.innerHTML = "&#10005";
        h1.innerHTML = "Wiadomość nie została wysłana."
        p.innerHTML = "Wprowadź wszystkie dane."
        let message = document.querySelectorAll('.email-sent')[0];
        message.style.display = 'block';
        message.style.opacity = 1
        return;
    }
    emailjs.send("service_8cdqnsf", "template_hz1sklm", params).then(openMail())
}
function openMail(){
    let sign = document.getElementById('email-sent-sign')
    let h1 = document.getElementById('email-sent-h1')
    let p = document.getElementById('email-sent-p')
    sign.innerHTML = "&#10003;";
    h1.innerHTML = "Wiadomość została wysłana"
    p.innerHTML = "Odezwę się jak najszybciej."
    let message = document.querySelectorAll('.email-sent')[0]; 
    message.style.opacity = 1;
    message.style.display = 'block';
}

async function closeEmail() {
    let message = document.querySelectorAll('.email-sent')[0];
    message.style.opacity = 0;
    await new Promise(r => setTimeout(r, 300)) 
    message.style.display = 'none';
}
