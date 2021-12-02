const startButton = document.getElementById('start-btn');
const containerDiv = document.getElementById('container');
const userName = document.getElementById('userName');
const startCard = document.getElementById('start-card');
const questionContainer = document.getElementById('question-container');
const displyName = document.getElementById('disply-name');
const questionDiv = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const nextButton2 = document.getElementById('next-btn2');
const endButton = document.getElementById('end-btn');
const dragContainer = document.getElementById('dragContainer');
const pickBoxes = document.querySelectorAll('.box');
const page = document.getElementById('page');
const results = document.getElementById('results');
let shuffelQuestions, currentQuestionIndex, circles;
let counter = 0;
let correctCounter = 0;
let isInOrder = true;
let innerCounter = 0;

const questions = [
  {
    question: 'How much is 5 * 5?',
    answers: [
      { text: '22', correct: false },
      { text: '25', correct: true },
      { text: '23', correct: false },
      { text: '30', correct: false },
    ],
  },
  {
    question: `start <input type="text" name="answerInput"  id="answerInput" /> end <br/><small>(the answer is "to")</small>`,
    answers: [{ text: 'to', correct: true }],
  },
  {
    question: 'Drag to match',
    type: 'drag',
  },
];

startButton.addEventListener('click', startTrivia);
userName.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    startTrivia();
  }
});
function setCurrent() {
  currentQuestionIndex++;

  circles.forEach(function (circle, index) {
    if (index === currentQuestionIndex) {
      circle.classList.add('red-circle');
    }
  });
}
function displayEnd() {
  questionContainer.classList.add('hide');
  if (correctCounter === questions.length) {
    results.innerText = `${userName.value},You got ${correctCounter}, Well done!`;
  } else {
    results.innerText = `${userName.value},You got ${correctCounter}, You can do better!`;
  }
}
nextButton.addEventListener('click', (e) => {
  setCurrent();

  const isEnd = checkIfEndGame();
  if (!isEnd) {
    next();
  } else {
    displayEnd();
  }
});
nextButton2.addEventListener('click', (e) => {
  setCurrent();

  console.log('e', e);
  pickBoxes.forEach((box) => {
    if (box.dataset.color === box.firstElementChild.dataset.color) {
      innerCounter++;
    }
  });
  if (innerCounter === questions.length) {
    correctCounter++;
  }

  const isEnd = checkIfEndGame();
  if (!isEnd) {
    next();
  } else {
    displayEnd();
  }
});
endButton.addEventListener('click', () => {
  questionContainer.classList.add('hide');

  results.innerText = `Your got ${counter} right`;
});

function startTrivia() {
  startCard.classList.add('hide');
  questionContainer.classList.remove('hide');
  displyName.classList.remove('hide');
  shuffelQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  containerDiv.classList.add('slide');
  questions.forEach((item, index) => {
    const circleDiv = document.createElement('div');
    circleDiv.classList.add('circle');
    if (index === 0) {
      circleDiv.classList.add('red-circle');
    }
    page.appendChild(circleDiv);
  });
  circles = document.querySelectorAll('.circle');
  next();
}

function next() {
  resetAswers();
  displyName.innerText = `Welcome ${userName.value}`;
  containerDiv.classList.add('slide');
  displyNextQuestion(shuffelQuestions[currentQuestionIndex]);
}

function removeHideClass() {
  let setClass;
  clearTimeout(setClass);
  function removeClass() {
    setClass = setTimeout(function () {
      containerDiv.classList.remove('slide');
    }, 1300);
  }
  removeClass();
}

function handleDragStart(e) {
  this.style.opacity = '0.3';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  pickBoxes.forEach(function (box) {
    box.classList.remove('over');
  });
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  e.stopPropagation();
  //   console.log(isInOrder);
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  let innerCounter2 = 0;
  pickBoxes.forEach((box) => {
    if (box.dataset.color === box.firstElementChild.dataset.color) {
      innerCounter2++;
    }
    if (innerCounter2 === questions.length) {
      document.body.classList.add('correct');
      console.log('All 3 Drags');
    }
  });
  return false;
}

function displyDragging(question) {
  questionDiv.innerText = question.question;
  dragContainer.classList.remove('hide');
  pickBoxes.forEach(function (box) {
    box.addEventListener('dragstart', handleDragStart);
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('dragenter', handleDragEnter);
    box.addEventListener('dragleave', handleDragLeave);
    box.addEventListener('dragend', handleDragEnd);
    box.addEventListener('drop', handleDrop);
  });
  nextButton2.classList.remove('hide');
}

function displayMultiple(question) {
  questionDiv.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}

function displayWordsCompletion(question) {
  nextButton.classList.remove('hide');

  questionDiv.innerHTML = question.question;
  const answerInput = document.getElementById('answerInput');
  // Check if the answer is correct and change disply
  answerInput.addEventListener('input', (event) => {
    if (event.target.value === question.answers[0].text) {
      document.body.classList.add('correct');
      correctCounter++;
      counter++;
      console.log('correctCounter', correctCounter);
    }
  });
}

function displyNextQuestion(question) {
  removeHideClass();

  // if Dragging, disply this:
  if (question.type === 'drag') {
    displyDragging(question);
  } else if (question.answers.length > 1) {
    // if multiple answers, disply this:
    displayMultiple(question);
  } else {
    // if complete words, disply this:
    displayWordsCompletion(question);
  }
}

function resetAswers() {
  nextButton.classList.add('hide');
  nextButton2.classList.add('hide');
  dragContainer.classList.add('hide');
  document.body.classList.remove('correct');
  document.body.classList.remove('wrong');
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(event) {
  const isCorrect = event.target.dataset.correct;
  nextButton.classList.remove('hide');
  if (isCorrect) {
    document.body.classList.add('correct');
    correctCounter++;
    counter++;
  } else if (!isCorrect) {
    document.body.classList.add('wrong');
  }
}
function checkIfEndGame() {
  if (shuffelQuestions.length === currentQuestionIndex) {
    return true;
  } else {
    return false;
  }
}
