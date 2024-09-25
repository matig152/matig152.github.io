let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');


//#region CANVAS SIZE AND POSITION
let canvas_container = document.getElementById('canvas-container');
canvas_height = canvas_container.clientHeight;
canvas_width = canvas_container.clientWidth;
canvas.height = canvas_height;
canvas.width = canvas_width;

centerX = canvas_width / 2
centerY = canvas_height / 2
//#endregion

//#region CIRCLE CLASS
class Circle{
    constructor(xpos, ypos, radius, outline_color, fill_color){
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.outline_color = outline_color;
        this.fill_color = fill_color;
    }
    draw(context){
        context.beginPath();
        context.strokeStyle = this.outline_color;
        context.arc(this.xpos, this.ypos, this.radius, 0, 
        Math.PI * 2, false);
        context.fillStyle = this.fill_color;
        context.fill()
        context.stroke();
    }
}
//#endregion

//#region PHYSICAL PARAMETERS
const g = 9.81; // Przyspieszenie grawitacyjne (m/s^2)
let L1 = 1;   // Długość pierwszego wahadła (m)
let L2 = 1;   // Długość drugiego wahadła (m)
let m1 = 1;   // Masa pierwszego wahadła (kg)
let m2 = 1;   // Masa drugiego wahadła (kg)
//#endregion

//#region DEFINE THE SYSTEM
function doublePendulumEquations(theta1, omega1, theta2, omega2) {
    const dOmega1 = (-g * (2 * m1 + m2) * Math.sin(theta1) - m2 * g * Math.sin(theta1 - 2 * theta2) 
    - 2 * Math.sin(theta1 - theta2) * m2 * (L2 * omega2 ** 2 + L1 * omega1 ** 2 * Math.cos(theta1 - theta2))) 
    / (L1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2)));
    
    const dOmega2 = (2 * Math.sin(theta1 - theta2) * (L1 * omega1 ** 2 * (m1 + m2) + g * (m1 + m2) * Math.cos(theta1) 
    + L2 * omega2 ** 2 * m2 * Math.cos(theta1 - theta2))) 
    / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2)));
  
    return {
      dTheta1: omega1,      // dtheta1/dt = omega1
      dOmega1: dOmega1,     // domega1/dt = (równanie złożone)
      dTheta2: omega2,      // dtheta2/dt = omega2
      dOmega2: dOmega2      // domega2/dt = (równanie złożone)
    };
}
//#endregion

//#region RUNGE KUTTA ALGORITM
function rungeKuttaStep(theta1, omega1, theta2, omega2, dt) {
    // Krok 1
    let k1 = doublePendulumEquations(theta1, omega1, theta2, omega2);
    
    // Krok 2
    let k2 = doublePendulumEquations(
      theta1 + 0.5 * dt * k1.dTheta1,
      omega1 + 0.5 * dt * k1.dOmega1,
      theta2 + 0.5 * dt * k1.dTheta2,
      omega2 + 0.5 * dt * k1.dOmega2
    );
    
    // Krok 3
    let k3 = doublePendulumEquations(
      theta1 + 0.5 * dt * k2.dTheta1,
      omega1 + 0.5 * dt * k2.dOmega1,
      theta2 + 0.5 * dt * k2.dTheta2,
      omega2 + 0.5 * dt * k2.dOmega2
    );
    
    // Krok 4
    let k4 = doublePendulumEquations(
      theta1 + dt * k3.dTheta1,
      omega1 + dt * k3.dOmega1,
      theta2 + dt * k3.dTheta2,
      omega2 + dt * k3.dOmega2
    );
    
    // Aktualizacja pozycji i prędkości kątowych
    let newTheta1 = theta1 + (dt / 6) * (k1.dTheta1 + 2 * k2.dTheta1 + 2 * k3.dTheta1 + k4.dTheta1);
    let newOmega1 = omega1 + (dt / 6) * (k1.dOmega1 + 2 * k2.dOmega1 + 2 * k3.dOmega1 + k4.dOmega1);
    let newTheta2 = theta2 + (dt / 6) * (k1.dTheta2 + 2 * k2.dTheta2 + 2 * k3.dTheta2 + k4.dTheta2);
    let newOmega2 = omega2 + (dt / 6) * (k1.dOmega2 + 2 * k2.dOmega2 + 2 * k3.dOmega2 + k4.dOmega2);
  
    return { theta1: newTheta1, omega1: newOmega1, theta2: newTheta2, omega2: newOmega2 };
}
//endregion




//#endregion

//#region INITIAL CONDITIONS
var theta1 = Math.PI; // 90 stopni
var omega1 = 0;           // Brak początkowej prędkości kątowej pierwszego wahadła
var theta2 = Math.PI / 4; // 45 stopni
var omega2 = 0;           // Brak początkowej prędkości kątowej drugiego wahadła
var dt = 1/60;                   // Krok czasowy (sekundy)
var time = 0;
//#endregion

//#region USER PARAMETERS
var form = document.getElementById("pendulumForm");

form.addEventListener('submit', handleForm);

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};

    // Iterowanie po danych formularza i dodawanie ich do obiektu
    formData.forEach((value, key) => {
        data[key] = value; // Dodajemy wartość do obiektu
    });

    return data; // Zwracamy obiekt z danymi
}

function handleForm(event) { 
    event.preventDefault(); 
    const collectedData = collectFormData(this); // Zbieranie danych
     // Wyświetlenie danych w konsoli

    

    if(eval(collectedData.mass1) == 0 || eval(collectedData.mass2) == 0 || eval(collectedData.length1) == 0 || eval(collectedData.length2) == 0){
        alert("Masy i długości wahadeł nie mogą być zerami!");
        return;
    }
    //console.log(collectedData);

    cancelAnimationFrame(requestID);
    system_history_coordinates = []
    context.clearRect(0,0, canvas_width, canvas_height)
    theta1 = eval(collectedData.angle1) * Math.PI / 180;
    omega1 = eval(collectedData.omega1)
    theta2 = eval(collectedData.angle2) * Math.PI / 180;
    omega2 = eval(collectedData.omega2)
    m1 = eval(collectedData.mass1);
    m2 = eval(collectedData.mass2);
    L1 = eval(collectedData.length1);
    L2 = eval(collectedData.length2);
    dt = eval(collectedData.animationSpeed * 1/60)

    if(collectedData.showTrajectory1){
        trajectory_1 = true;
        trajectory_1_color = collectedData.ball1Color;
    }
    else{
        trajectory_1 = false
    }

    if(collectedData.showTrajectory2){
        trajectory_2 = true
        trajectory_2_color = collectedData.ball2Color;
    }
    else{
        trajectory_2 = false
    }
    pendulum_length_m_to_px = canvas_height / 4
    pendulum_hang_X = centerX;
    pendulum_hang_Y = centerY - pendulum_length_m_to_px * (L1 + L2) / 2
    pendulum_length_1 = L1 * pendulum_length_m_to_px
    pendulum_length_2 = L2 * pendulum_length_m_to_px
    
    animateMovement();
    
} 

//#endregion


//#region ANIMATION


let pendulum_length_m_to_px = canvas_height / 4
let pendulum_hang_X = centerX;
let pendulum_hang_Y = centerY - pendulum_length_m_to_px * (L1 + L2) / 2
let pendulum_length_1 = L1 * pendulum_length_m_to_px
let pendulum_length_2 = L2 * pendulum_length_m_to_px

system_history_coordinates = []

let trajectory_1 = true;
let trajectory_2 = true;
let trajectory_1_color = "#979c49";
let trajectory_2_color = "#789aff";

let animateMovement = function(){
    context.clearRect(0,0,canvas_width, canvas_height); //clear prevoius frame

    let ball_1 = new Circle(centerX, centerY, m1 * canvas_width / 70, "#789aff", "#789aff");
    let ball_2 = new Circle(centerX, centerY, m2 * canvas_width / 70, "#789aff", "#789aff");
    

    // CALCULATE THE NEXT STEP
    // Wykonanie kroku metody RK4

    let nextStep = rungeKuttaStep(theta1, omega1, theta2, omega2, dt);
    theta1 = nextStep.theta1;
    omega1 = nextStep.omega1;
    theta2 = nextStep.theta2;
    omega2 = nextStep.omega2;
    time += dt;
    

    // CALCULATE COORDINATES
    ball_1_x = pendulum_length_1 * Math.sin(theta1) + pendulum_hang_X;
    ball_1_y = pendulum_length_1 * Math.cos(theta1) + pendulum_hang_Y;
    ball_2_x = ball_1_x + pendulum_length_2 * Math.sin(theta2);
    ball_2_y = ball_1_y + pendulum_length_2 * Math.cos(theta2);

    system_history_coordinates.push([ball_1_x, ball_1_y, ball_2_x, ball_2_y])
    history_length = 60
    if(system_history_coordinates.length > history_length){
        system_history_coordinates = system_history_coordinates.slice(system_history_coordinates.length - history_length)
    }

    

    // DRAW THE LINES
    context.beginPath();
    context.lineWidth = 1;
    context.shadowBlur = 0;
    context.strokeStyle = "white"
    context.moveTo(pendulum_hang_X, pendulum_hang_Y);
    context.lineTo(ball_1_x, ball_1_y);
    context.stroke();

    context.beginPath();
    context.moveTo(ball_1_x, ball_1_y);
    context.lineTo(ball_2_x, ball_2_y);
    context.stroke();
    
    // DRAW THE BALLS AT NEW POSITION
    ball_1.xpos = ball_1_x;
    ball_1.ypos = ball_1_y;
    ball_2.xpos = ball_2_x;
    ball_2.ypos = ball_2_y;
    context.shadowColor = "#789aff"
    context.shadowBlur = 10;
    ball_1.draw(context);
    ball_2.draw(context);


    // DRAW FIRST BALL TRAJECTORY 
    if(trajectory_1){
        context.beginPath();
        context.shadowBlur = 0;
        context.lineWidth = 0.02;
        for(let i = 0; i < system_history_coordinates.length - 1; i++){
            context.strokeStyle = trajectory_1_color;
            context.moveTo(system_history_coordinates[i][0], system_history_coordinates[i][1])
            context.quadraticCurveTo(system_history_coordinates[i+1][0], system_history_coordinates[i+1][1], system_history_coordinates[i+1][0], system_history_coordinates[i+1][1])
            context.stroke();
        }
    }


    // DRAW SECOND BALL TRAJECTORY 
    if(trajectory_2){
        context.beginPath();
        context.shadowBlur = 0;
        context.lineWidth = 0.02;
        for(let i = 0; i < system_history_coordinates.length - 1; i++){
            context.strokeStyle = trajectory_2_color;
            context.moveTo(system_history_coordinates[i][2], system_history_coordinates[i][3])
            context.quadraticCurveTo(system_history_coordinates[i+1][2], system_history_coordinates[i+1][3], system_history_coordinates[i+1][2], system_history_coordinates[i+1][3])
            context.stroke();
        }
    }
    requestID = requestAnimationFrame(animateMovement);
}
//#endregion


//#region START, PAUSE, RESTART ANIMATION
let isAnimating;

function startAnimation(){
    animateMovement();
    isAnimating = true;
}
startAnimation();

canvas.addEventListener("click", function(){
    if(isAnimating){
        cancelAnimationFrame(requestID);
        isAnimating = false;
    }
    else{
        requestAnimationFrame(animateMovement);
        isAnimating = true;
    }
})



//#endregion


