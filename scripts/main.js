const infoCard = document.querySelector('.info-card');
const nextButton = infoCard.querySelector('button.btn');
const tapArea = document.getElementById('tap-area');
const thumb = document.getElementById('thumb');

const LEFT_HAND = 'left';
const RIGHT_HAND = 'right';
let activeHand = LEFT_HAND;
let testingTaps = false;
const data = {
  'left': {
    tries: 0
  },
  'right': {
    tries: 0
  }
};
let timeStarted;
let _taps = 0;

showThumb(false);

nextButton.addEventListener('click', evt => {
  // Transform away the card and start the main program
  infoCard.classList.add('done');
  startTapTesting();
});

tapArea.addEventListener('click', evt => {
  if (!timeStarted && testingTaps) {
    timeStarted = new Date();
    checkTimelimit();
  }

  if (testingTaps) {
    _taps += 1;

    tapArea.innerHTML = `
    <div>
      You are on try number <b>${data[activeHand].tries + 1}</b>,
      and you have tapped <b>${_taps}</b> times!
    </div>
    `;

    showThumb();
  }
});

function startTapTesting() {
  tapArea.innerHTML = `
  <h1>Testing your ${activeHand} index finger</h1>
  <h2>Start tapping to start the test!</h2>
  `;

  setTimeout(() => {
    testingTaps = true;
  }, 1000);
}

function checkTimelimit() {
  let interval = setInterval(() => {
    if (new Date() - timeStarted > 10000) {
      console.log('outta time');
      testingTaps = false;
      timeStarted = false;
      clearInterval(interval);

      if (data[RIGHT_HAND].tries >= 4) {
        let tryNum = data[activeHand].tries;
        data[activeHand]['try' + tryNum] = _taps;

        testingTaps = false;
        showResults();
      } else if (data[activeHand].tries >= 4) {
        let tryNum = data[activeHand].tries;
        data[activeHand]['try' + tryNum] = _taps;

        activeHand = RIGHT_HAND;
        prepareNextTry();
      } else {
        let tryNum = data[activeHand].tries;
        data[activeHand]['try' + tryNum] = _taps;

        prepareNextTry();
        data[activeHand].tries += 1;
      }
    }
  }, 0.1);
}

function prepareNextTry() {
  _taps = 0;
  testingTaps = false;

  tapArea.innerHTML = `
  <h2>
    Get ready for your next try on your <strong>${activeHand}</strong> index finger! Tap the screen to start.
  </h2>
  `;

  showThumb(false);

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
  showThumb(false);
}

function showThumb(show = true) {
  if (show) {
    thumb.style.opacity = 1;
    return;
  }

  thumb.style.opacity = 0;
}

function mock() {
  for (let i = 0; i < 5; i++) {
    data[LEFT_HAND]['try'+i] = Math.pow(i + 1, 2);
    data[RIGHT_HAND]['try'+i] = Math.pow(i + 1, 2);
  }

  data[LEFT_HAND].tries = 4;
  data[RIGHT_HAND].tries = 4;
}
