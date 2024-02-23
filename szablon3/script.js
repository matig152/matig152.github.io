//Design functions
function mobilemenu(){
    const menu = document.getElementsByClassName("mobilemenu")[0];
    if(menu.offsetHeight == "0"){
      if(screen.orientation.type!="landscape-primary"){
        menu.style.height= "400px";
      }
      else{
        menu.style.height= "34vh";
      }
    }
    else{
        menu.style.height= "0rem";
    }
}


const card = document.querySelectorAll('.picturea')
const underlins = document.querySelectorAll('.underline')
const parag = document.querySelectorAll('.aboutp')
const onasnagl = document.querySelectorAll('.onasnaglowek')
const onaspicture = document.querySelectorAll('.onaspicture')
const onastext = document.querySelectorAll('.onastext')

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry => {
    entry.target.classList.toggle("show", entry.isIntersecting)
    if(entry.isIntersecting){
      observer.unobserve(entry.target)
    }
  })
},
{
  threshold: 0.7,
})

card.forEach(it =>{
observer.observe(it)
})
underlins.forEach(it =>{
  observer.observe(it)
  })    
parag.forEach(it =>{
   observer.observe(it)
 })       
 onasnagl.forEach(it =>{
  observer.observe(it)  
 })   
 onaspicture.forEach(it =>{
  observer.observe(it)  
 })   
 onastext.forEach(it =>{
  observer.observe(it)  
 })   
        