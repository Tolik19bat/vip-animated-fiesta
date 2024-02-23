// Экспорт класса Card по умолчанию
export default class Card {
  constructor(text) {
    // Создание элемента карточки
    this.element = document.createElement('div');
    // Добавление класса 'card' к элементу карточки
    this.element.classList.add('card');
    // Установка текста карточки
    this.element.textContent = text;
    // Привязка контекста для обработчиков событий
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    // Добавление обработчиков событий
    this.element.addEventListener('mouseenter', this.onMouseEnter);
    this.element.addEventListener('mouseleave', this.onMouseLeave);
    // Создание элемента кнопки удаления карточки
    this.btnRemoveEl = document.createElement('div');
    // Добавление классов к элементу кнопки удаления
    this.btnRemoveEl.classList.add('card-remover', 'hidden');
    // Вставка кнопки удаления в элемент карточки
    this.element.appendChild(this.btnRemoveEl);
    // Добавление обработчика события клика по кнопке удаления
    this.btnRemoveEl.addEventListener('click', this.onClickRemove);
  }

  // Метод обработки события клика по кнопке удаления
  onClickRemove() {
    // Удаление родительского контейнера карточки
    this.element.closest('.card-container').remove();
  }

  // Метод обработки события наведения мыши на карточку
  onMouseEnter() {
    // Удаление класса 'hidden' для показа кнопки удаления
    this.btnRemoveEl.classList.remove('hidden');
  }

  // Метод обработки события увода мыши с карточки
  onMouseLeave() {
    // Добавление класса 'hidden' для скрытия кнопки удаления
    this.btnRemoveEl.classList.add('hidden');
  }
}