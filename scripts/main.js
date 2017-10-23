const infoCard = document.querySelector('.info-card');
const nextButton = infoCard.querySelector('button.btn');
const tapArea = document.getElementById('tap-area');

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
    You are on try number <b>${data[activeHand].tries + 1}</b>,
    and you have tapped <b>${_taps}</b> times!
    `;
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
    if (new Date() - timeStarted > 1000) {
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
  testingTaps = false;

  tapArea.innerHTML = `
  Get ready for your next try on your ${activeHand} index finger! Tap the screen to start.
  `;

  setTimeout(() => {
    testingTaps = true;
  }, 1000);
}

function showResults() {
  let leftTriesKeys = Object.keys(data[LEFT_HAND]).filter(key => {
    return key.indexOf('key') !== -1;
  });
  let rightTriesKeys = Object.keys(data[RIGHT_HAND]).filter(key => {
    return key.indexOf('key') !== -1;
  });

  let sum = 0;
  let leftAverage;
  let rightAverage;

  for (let i = 0; i < 5; i++) {
    sum += data[LEFT_HAND]['try' + i];
  }

  leftAverage = sum / 5;
  sum = 0;

  for (let i = 0; i < 5; i++) {
    sum += data[RIGHT_HAND]['try' + i];
  }

  rightAverage = sum / 5;

  let tbody = '';
  for (let i = 0; i < 5; i++) {
    let tr = `<tr>Try ${i + 1}`;
    let left;
    let right;
    for (let j = 0; j < 2; j++) {
      if (j = 0) {
        left = `<td>${data[LEFT_HAND]['try' + i]}</td>`;
      } else {
        right = `<td>${data[RIGHT_HAND]['try' + i]}</td>`;
      }
    }
    tr += '${left}${right}</tr>';
    tbody += tr;
  }

  tapArea.innerHTML = `
  <h1>Your results</h1>
  <table>
    <tbody>
      ${tbody}
    </tbody>
  </table>
  `;
}
