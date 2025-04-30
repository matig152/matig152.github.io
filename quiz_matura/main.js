var questions = []
fetch('pytania.json', { 
    method: 'GET'
  })
  .then(function(response) { return response.json(); })
  .then(function(json) {
    
    for (let i = 0; i < json.questions.length; i++){
        var question = json.questions[i];


        var question_div = document.createElement("div");
        question_div.classList = ["question"]

        // treść pytania
        var question_header = document.createElement("h1");
        question_header.classList = ["question_header"]
        question_header.innerHTML = `Pytanie ${i+1}. ${question.questionText}`
        question_div.appendChild(question_header)
        // obrazek pytania
        if(question.image != null) {
            var question_image = document.createElement("div");
            question_image.classList = ["question_img"]
            var question_image_img = document.createElement("img");
            question_image_img.src = question.image;
            question_image.appendChild(question_image_img);
            question_div.appendChild(question_image)
        }
        // odpowiedzi
        var answers_span = document.createElement("span");
        answers_span.classList = ["answers"];
        for(let j = 0; j < question.answers.length; j++){
            // checkbox
            var answer_check = document.createElement("input");
            answer_check.type = "checkbox"
            answer_check.id = `checkbox_question${i+1}_answer${j+1}`
            answer_check.classList = ["answer_check"]
            answers_span.appendChild(answer_check)
            // treść
            answers_span.innerHTML += `<p id='text_question${i+1}_answer${j+1}' style='margin-right:4px;display: inline-block'>  ${question.answers[j].text}</p><br>`
        }
        question_div.appendChild(answers_span);



        // napisz pytanie
        document.getElementById('wrapper').appendChild(question_div)
        MathJax.typesetPromise();

    }
    //console.log(document.body.innerHTML);
    questions = json.questions;
});



function check(){
    score = 0
    for(let i = 0; i < questions.length; i++){
        n_correct_answers = 0
        correct_answers = []
        for(let j = 0; j < questions[i].answers.length; j++){
            correct_answers.push(questions[i].answers[j].isCorrect)
            if(questions[i].answers[j].isCorrect){n_correct_answers += 1}
        }
        user_answers = []
        for(let j= 0; j < questions[i].answers.length; j++){
            var checkbox = document.getElementById(`checkbox_question${i+1}_answer${j+1}`);
            user_answers.push(checkbox.checked)
        }
        n_correct = 0
        n_incorrect_checked = 0
        for(let j = 0; j<questions[i].answers.length; j++){
            if(correct_answers[j] && user_answers[j]){n_correct += 1}
            if(!correct_answers[j] && user_answers[j]){n_incorrect_checked += 1}
        }
        score += 10*n_correct/n_correct_answers;
        if(n_correct > 0){
        score -= 2*n_incorrect_checked/n_correct_answers;
        }
    }
    document.getElementById('score').innerHTML = `Wynik:\n ${Math.round(score)} / ${10*questions.length}`
    document.getElementById('procent').innerHTML = `${Math.round(100* score/(10*questions.length))} %`

    const spans = document.querySelectorAll('span.mark_span');
    spans.forEach(span => {
        span.remove();
    });

    for(let i = 0; i < questions.length; i++){
        for(let j = 0; j < questions[i].answers.length; j++){
            var true_answer = questions[i].answers[j].isCorrect
            var checkbox = document.getElementById(`checkbox_question${i+1}_answer${j+1}`);
            var answer_text_p = document.getElementById(`text_question${i+1}_answer${ j+1}`);
            if(checkbox.checked && true_answer){answer_text_p.innerHTML += " <span class='mark_span' style='font-size:25px;color:green'>  &#10003;</span>";}
            if(checkbox.checked && !true_answer){answer_text_p.innerHTML += " <span class='mark_span' style='font-size:25px;color:red'>  &#10005;</span>"}
        }
    }


}