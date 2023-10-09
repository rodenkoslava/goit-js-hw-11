export function slowlyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  const scrollAmount = cardHeight;

  window.scrollBy({
    top: scrollAmount,
    behavior: 'smooth',
  });
}
