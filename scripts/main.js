const infoCards = document.querySelector('.info-cards');

infoCards.querySelectorAll('.card button.btn').forEach(button => {
  button.addEventListener('click', evt => {
    evt.target.parentElement.classList.add('done');
    const nextCards = Array.prototype.filter.call(infoCards.children, card => {
      return card !== evt.target.parentElement;
    });
    nextCards[0].classList.remove('hidden');
  });
});
