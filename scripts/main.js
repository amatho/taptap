const infoCards = document.querySelector('.info-cards');
const shadow = document.querySelector('.shadow');

infoCards.querySelectorAll('.card button.btn').forEach(button => {
  button.addEventListener('click', evt => {
    evt.target.parentElement.classList.add('done');
    const nextCards = Array.prototype.filter.call(infoCards.children, card => {
      return card !== evt.target.parentElement &&
        !card.classList.contains('done');
    });

    if (nextCards.length <= 0) {
      shadow.classList.add('disabled');
      return;
    }

    nextCards[0].classList.remove('hidden');
  });
});
