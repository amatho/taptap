const infoCard = document.querySelector('.info-card');
const nextButton = infoCard.querySelector('button.btn');
const tapArea = document.getElementById('tap-area');
const nextTryEl = document.getElementById('next-try');
const tapToStartEl = document.getElementById('tap-to-start');
const tapCountEl = document.getElementById('tap-count');
const timeLeftEl = document.getElementById('time-left');
const tryCountEl = document.getElementById('try-count');

const LEFT_HAND = 'left';
const RIGHT_HAND = 'right';
let testingTaps = false;
let tryCount = 0;
let timeStarted;
let _taps = 0;

const data = {
  'left': {},
  'right': {}
};

nextButton.addEventListener('click', evt => {
  // Transform away the card and start the main program
  infoCard.classList.add('done');
  tapArea.classList.remove('hidden');
  startTapTesting();
});

tapArea.addEventListener('click', evt => {
  if (!timeStarted && testingTaps) {
    timeStarted = new Date();
    showHelpText(false);
    checkTimelimit();
  }

  if (testingTaps) {
    _taps++;

    tapCountEl.innerHTML = _taps;
  }
});

function startTapTesting() {
  nextTryEl.innerHTML = `Get ready to test your
    <i><u>${getHand(tryCount)}</u></i> index finger!`;
  tapCountEl.innerHTML = _taps;
  timeLeftEl.innerHTML = 10;
  tryCountEl.innerHTML = tryCount + 1;
  showHelpText(true);

  setTimeout(() => {
    testingTaps = true;
  }, 1000);
}

function checkTimelimit() {
  let interval = setInterval(() => {
    timeLeftEl.innerHTML = timeLeftInSeconds(timeStarted);

    if (new Date() - timeStarted > 10000) {
      console.log('outta time');
      testingTaps = false;
      timeStarted = false;
      clearInterval(interval);

      const currentHand = tryCount % 2 ? RIGHT_HAND : LEFT_HAND;

      if (tryCount >= 9) {
        data[currentHand]['try' + calculateTryNum(tryCount)] = _taps;

        testingTaps = false;
        showResults();
      } else {
        data[currentHand]['try' + calculateTryNum(tryCount)] = _taps;

        prepareNextTry();
      }
    }
  }, 0.1);
}

function prepareNextTry() {
  _taps = 0;
  tryCount++;
  testingTaps = false;

  nextTryEl.innerHTML = `Get ready for your next try on your
    <i><u>${getHand(tryCount)}</u></i> index finger!`;
  tapCountEl.innerHTML = _taps;
  timeLeftEl.innerHTML = 10;
  tryCountEl.innerHTML = tryCount + 1;
  showHelpText(true);

  setTimeout(() => {
    testingTaps = true;
  }, 1000);
}

function showResults() {
  const table = document.createElement('table');
  table.createTHead().innerHTML = `
  <tr>
    <th>Try Number</th>
    <th>Left Hand</th>
    <th>Right Hand</th>
  </tr>
  `;
  const tbody = table.createTBody();

  const leftNumbers = Object.keys(data[LEFT_HAND])
    .filter(key => key.indexOf('try') !== -1)
    .map(key => {
      return Number(data[LEFT_HAND][key]);
    });

  const rightNumbers = Object.keys(data[RIGHT_HAND])
    .filter(key => key.indexOf('try') !== -1)
    .map(key => {
      return Number(data[RIGHT_HAND][key]);
    });

  const leftAverage = leftNumbers.reduce((acc, val) => {
    return acc + val;
  }) / leftNumbers.length;

  const rightAverage = rightNumbers.reduce((acc, val) => {
    return acc + val;
  }) / rightNumbers.length;

  for (let i = 0; i < 5; i++) {
    const left = leftNumbers[i];
    const right = rightNumbers[i];

    const tr = `
    <tr>
      <td>${i + 1}</td>
      <td>${left}</td>
      <td>${right}</td>
    </tr>
    `;

    tbody.innerHTML += tr;
  }

  tbody.innerHTML += `
  <tr>
    <th>Average</th>
    <td>${leftAverage}</td>
    <td>${rightAverage}</td>
  </tr>
  `;

  tapArea.innerHTML = '<h1>Your results</h1>';
  tapArea.appendChild(table);
}

function timeLeftInSeconds(timeStarted) {
  return ((10000 - (new Date() - timeStarted)) / 1000).toFixed(1);
}

function showHelpText(shouldShow) {
  const opacity = shouldShow ? 1 : 0;

  nextTryEl.style.opacity = opacity;
  tapToStartEl.style.opacity = opacity;
}

function calculateTryNum(tryCount) {
  return Math.floor(tryCount / 2);
}

function getHand(tryCount) {
  return tryCount % 2 ? RIGHT_HAND : LEFT_HAND;
}

function mock() {
  for (let i = 0; i < 5; i++) {
    data[LEFT_HAND]['try'+i] = Math.pow(i + 1, 2);
    data[RIGHT_HAND]['try'+i] = Math.pow(i + 1, 2);
  }

  tryCount = 9;
}
