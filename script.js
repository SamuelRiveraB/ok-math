// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0
let equationsArray = [];
let playerGuessArray = []
let bestScoreArray = []

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer
let timePlayed = 0
let baseTime = 0
let penaltyTime = 0
let finalTime = 0

// Scroll
let valueY = 0

function bestScoresToDOM() {
  bestScores.forEach((bs, i) => {
    const bestScoreEl = bs
    bestScoreEl.textContent = `${bestScoreArray[i].bestScore}s`
  })
}

function getSavedBestScores() {
  if(localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.getItem('bestScores'))
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: `0.0`},
      { questions: 25, bestScore: `0.0`},
      { questions: 50, bestScore: `0.0`},
      { questions: 99, bestScore: `0.0`}
    ]
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM()
}

function updateBestScore() {
  bestScoreArray.forEach((score, i) => {
    if (questionAmount == score.questions) {
      const savedBestScore = Number(bestScoreArray[i].bestScore)
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[i].bestScore = finalTime
      }
    }
  })
  bestScoresToDOM()
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}

function playAgain() {
  scorePage.hidden = true
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0
}

function showScorePage() {
  scorePage.hidden = false
  gamePage.hidden = true
}

function scoresToDOM() {
  finalTime = finalTime.toFixed(2)
  baseTime = timePlayed.toFixed(2)
  penaltyTime = penaltyTime.toFixed(2)

  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`
  finalTimeEl.textContent = `${finalTime}s`
  updateBestScore()
  itemContainer.scrollTo({ top: 0, behaviour: 'instant'})
  showScorePage()
}

function checkTime() {
  if(playerGuessArray.length == questionAmount) {
    clearInterval(timer)
    equationsArray.forEach((eq, i) => {
      if(eq.evaluated === playerGuessArray[i]) {

      } else {
        penaltyTime += 0.5
      }
    })
    finalTime = timePlayed + penaltyTime
    scoresToDOM()
  }
}

function addTime() {
  timePlayed += 0.1
  checkTime()
}

function startTimer() {
  timePlayed = 0
  penaltyTime = 0
  finalTime = 0
  timer = setInterval(addTime, 100)
}

function select(guessedTrue) {
  valueY += 80
  itemContainer.scroll(0, valueY)
  if (playerGuessArray.length < questionAmount) {
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
  }
}

function showGame() {
  gamePage.hidden = false
  countdownPage.hidden = true
  startTimer()
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray)
}

function equationsToDOM() {
  equationsArray.forEach((eq) => {
    const item = document.createElement('div')
    item.classList.add('item')
    const eqText = document.createElement('h1')
    eqText.textContent = eq.value

    item.appendChild(eqText)
    itemContainer.appendChild(item)
  })
}

// Dynamically adding correct/incorrect equations

function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations()
  equationsToDOM()

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-232');
  itemContainer.appendChild(bottomSpacer);

  
}

function countdownStart() {
  let count = 3
  countdown.textContent = count
  const timeCountDown = setInterval(() => {
    count--
    if(count === 0) {
      countdown.textContent = 'GO!'
    } else if(count === -1) {
      showGame()
      clearInterval(timeCountDown)
    } else {
      countdown.textContent = count
    }
  }, 1000)
  // countdown.textContent = '3'
  // setTimeout(() => {
  //     countdown.textContent = '2'
  // }, 1000);
  //   setTimeout(() => {
  //     countdown.textContent = '1'
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = 'GO!'
  // }, 3000);
}

function showCountdown() {
  countdownPage.hidden = false
  splashPage. hidden = true
  countdownStart()
  populateGamePage()
  // setTimeout(showGame, 4000)
}

function getRadioValue() {
  let radioValue
  radioInputs.forEach((input) => {
    if(input.checked) {
      radioValue = input.value
    }
  })
  return radioValue
}

function selectQuestionAmount(e) {
  e.preventDefault()
  questionAmount = getRadioValue()
  if (questionAmount) {
    showCountdown()
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove('selected-label')
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
})

startForm.addEventListener('submit', selectQuestionAmount)

getSavedBestScores()