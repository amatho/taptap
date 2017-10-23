const infoCards = document.querySelector('.info-cards');
const shadow = document.querySelector('.shadow');
const tapArea = document.getElementById('tap-area');

const LEFT_HAND = 0;
const RIGHT_HAND = 1;
let activeHand = LEFT_HAND;
let testingTaps = false;
const data = {
  0: {},
  1: {}
};

infoCards.querySelectorAll('.card button.btn').forEach(button => {
  button.addEventListener('click', evt => {
    evt.target.parentElement.classList.add('done');
    const nextCards = Array.prototype.filter.call(infoCards.children, card => {
      return card !== evt.target.parentElement &&
        !card.classList.contains('done');
    });

    if (nextCards.length <= 0) {
      shadow.classList.add('disabled');
      startTapTesting();
      return;
    }

    nextCards[0].classList.remove('hidden');
  });
});

data[LEFT_HAND].taps = 0;
data[RIGHT_HAND].taps = 0;

tapArea.addEventListener('click', evt => {
  if (testingTaps) {
    data[activeHand].taps += 1;
  }

  tapArea.innerHTML = `
  You have tapped ${data[activeHand].taps} times!
  `;
});

function startTapTesting() {
  fingerName = activeHand ? 'right' : 'left';
  tapArea.innerHTML = `
  <h1>Testing your ${fingerName} index finger</h1>
  <h2>Start tapping to start the test!</h2>
  `;
  testingTaps = true;
}
