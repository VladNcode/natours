const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.signup');

const openModal = function () {
  modal.classList.remove('hiddenModal');
  overlay.classList.remove('hiddenModal');
  document.body.style.overflow = 'hidden';
};

const closeModal = function () {
  modal.classList.add('hiddenModal');
  overlay.classList.add('hiddenModal');
  document.body.style.overflow = '';
};

if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// document.addEventListener('click', e => {
//   if (e.target !== modal || !modal.classList.contains('hiddenModal'))
//     closeModal();
// });

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hiddenModal')) {
    closeModal();
  }
});

export default modal;
