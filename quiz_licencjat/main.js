function begin_test(n_questions){
    document.getElementsByClassName('initial')[0].style.display = 'none'

    fetch('questions.json').then(response => {
        return response.json();
    }).then(data => {
        questions = data.questions
        questions = questions.filter(item => item.correctIndex != null)
        console.log(`Liczba pytań opracowanych: ${questions.length}`)
        
        const shuffled_questions = shuffleArray(questions.slice());

        questions = shuffled_questions.slice(0, n_questions)
        window.questionsGlobal = questions

        questions_div = document.getElementsByClassName('questions')[0]
        for (let i = 0; i < questions.length; i++) {
            question = questions[i]

            questions_div.innerHTML += `
            <div class="question">
                <p class="question_id">id: ${question.id}</p>
                <h3 class="question_text">${i+1}. ${question.question}</h3>
                <div class="answers">
                    <input class="answer_check" id=${`check_1_${i}`} type="checkbox"> <span class="answer" id=${`answer_1_${i}`}>${question.options[0]}</span><br> 
                    <input class="answer_check" id=${`check_2_${i}`} type="checkbox"> <span class="answer" id=${`answer_2_${i}`}>${question.options[1]}</span><br>
                    <input class="answer_check" id=${`check_3_${i}`} type="checkbox"> <span class="answer" id=${`answer_3_${i}`}>${question.options[2]}</span><br>
                    <input class="answer_check" id=${`check_4_${i}`} type="checkbox"> <span class="answer" id=${`answer_4_${i}`}>${question.options[3]}</span><br>
                </div>
                <button class="explanation_button" id="explanation_button_${i}" onclick="show_explanation(${i})">Pokaż wyjaśnienie</button>
                <button class="hide_explanation_button" id="hide_explanation_button_${i}" onclick="hide_explanation(${i})">Ukryj wyjaśnienie</button>
            </div>
            <div class="question_explanation" id=${`explanation_${i}`}>
                Wyjaśnienie: ${question.explanation}
            </div>`
        }
        questions_div.style.display = "block"
        document.getElementsByClassName("check_test")[0].style.display = "grid"
        
        document.querySelectorAll('.answers').forEach(group => {
            const checkboxes = group.querySelectorAll('.answer_check');
            
            checkboxes.forEach(cb => {
            cb.addEventListener('change', function () {
                if (this.checked) {
                checkboxes.forEach(other => {
                    if (other !== this) other.checked = false;
                });
                }
            });
            });
        });
        MathJax.typesetPromise();

        }
    )
    
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

    

    







function check_test(){
    console.log(questionsGlobal)
    fetch('questions.json').then(response => {return response.json()}).then(data => {
        score = 0
        question_divs = document.querySelectorAll(".question")
        for(i = 0; i < question_divs.length; i++){
            user_response = 0
            if(document.getElementById(`check_1_${i}`).checked){user_response = 1}
            if(document.getElementById(`check_2_${i}`).checked){user_response = 2}
            if(document.getElementById(`check_3_${i}`).checked){user_response = 3}
            if(document.getElementById(`check_4_${i}`).checked){user_response = 4}
            correct_answer = questionsGlobal[i].correctIndex + 1
            if(user_response != 0){
                if(correct_answer == user_response){
                    score += 1
                    document.getElementById(`answer_${user_response}_${i}`).innerHTML += "  ✅"
                }
                else{
                    document.getElementById(`answer_${user_response}_${i}`).innerHTML += " ❌"
                    document.getElementById(`answer_${correct_answer}_${i}`).innerHTML += "  ✅"
                }
            }
            else{
                question_divs[i].querySelectorAll(".answers")[0].innerHTML += "Brak odpowiedzi ❌"
                document.getElementById(`answer_${correct_answer}_${i}`).innerHTML += "  ✅"
            }



        }
        document.getElementById("test_results").innerHTML = ` ${score} / ${question_divs.length} <br> ${Math.round((score/question_divs.length) * 100, 2)}%`
        document.getElementsByClassName("results")[0].style.display = "block"

        // PRZYCISKI Z WYJAŚNIENIEM
        expl_buttons = document.querySelectorAll(".explanation_button")
        expl_buttons.forEach(button => button.style.display = 'block')
        // DISABLE CHECKS
        cbs = document.querySelectorAll(".answer_check")
        cbs.forEach(cb => cb.disabled = "true")
        // UKRYJ PRZYCISK SPRAWDŹ
        document.getElementsByClassName("check_test")[0].style.display = "none"

        // ZJEDŹ NA DÓŁ
        window.scrollTo({
            top: document.body.scrollHeight
        });
    })
}


function show_explanation(question_id){
    document.getElementById(`explanation_${question_id}`).style.display = "block";
    document.getElementById(`explanation_button_${question_id}`).style.display = "none";
    document.getElementById(`hide_explanation_button_${question_id}`).style.display = "block";
}
function hide_explanation(question_id){
    document.getElementById(`explanation_${question_id}`).style.display = "none";
    document.getElementById(`explanation_button_${question_id}`).style.display = "block";
    document.getElementById(`hide_explanation_button_${question_id}`).style.display = "none";
}


