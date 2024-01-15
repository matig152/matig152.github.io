//#region FRONTEND CODE

//constants
let observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.toggle("show", entry.isIntersecting)
        } else {
        }
        });
    },
    { threshold: .4 }
);


//functions
async function hidepreloader(){
    await new Promise(r => setTimeout(r, 500));
    observers();
    const preloader = document.querySelectorAll('.preloader')[0];
    preloader.style.opacity = 0;
    await new Promise(r => setTimeout(r, 500));
    preloader.style.display = 'none';
    
}


function observers(){
    const info = document.querySelectorAll('.glownainfo')[0];
    const cenniknagl = document.querySelectorAll('.cenniknagl')[0];
    const cennikphoto = document.querySelectorAll('.cennikphoto')[0];
    const cennikgrid2 = document.querySelectorAll('.cennikgrid2')[0];
    observer.observe(info);
    observer.observe(cenniknagl);
    observer.observe(cennikphoto);
    observer.observe(cennikgrid2);
}

async function mobilemenu(){
    const menu = document.querySelectorAll('.mobilemenu')[0];
    const maska = document.querySelectorAll('.mask')[0];
    menu.style.width = '160px';
    maska.style.display = "block";
    await new Promise(r => setTimeout(r, 1));
    maska.style.opacity = "1";
}

async function hidemenu(){
    const menu = document.querySelectorAll('.mobilemenu')[0];
    const maska = document.querySelectorAll('.mask')[0];
    menu.style.width = '0';
    maska.style.opacity = "0";
    await new Promise(r => setTimeout(r, 500));
    maska.style.display = "none";
}
//#endregion


//#region BACKEND CODE

//constants

//functions

//#endregion