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
  console.log('click');
  infoCard.classList.add('done');
  startTapTesting();
});

tapArea.addEventListener('click', evt => {
  if (!timeStarted) {
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
  fingerName = activeHand ? 'right' : 'left';
  tapArea.innerHTML = `
  <h1>Testing your ${fingerName} index finger</h1>
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

      if (data[activeHand].tries >= 4) {
        activeHand = RIGHT_HAND;
        prepareNextTry();
      } else if (data[RIGHT_HAND].tries >= 4) {
        testingTaps = false;
        return;
      } else {
        data[activeHand].tries += 1;
        prepareNextTry();
      }

    }
  }, 0.1);
}

function prepareNextTry() {
  testingTaps = false;
  let tryNum = data[activeHand].tries;
  let taps = data[activeHand].taps;
  data[activeHand]['try' + tryNum] = taps;
  data[activeHand].taps = 0;

  tapArea.innerHTML = `
  Get ready for your next try on your ${activeHand} index finger! Tap the screen to start.
  `;

  setTimeout(() => {
    testingTaps = true;
  }, 1000);
}
