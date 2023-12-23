async function hidePreloader(){
    let preloader = document.querySelector('.preloader')
    await new Promise(r => setTimeout(r, 2000)) 
    preloader.style.top = "-100%"
}