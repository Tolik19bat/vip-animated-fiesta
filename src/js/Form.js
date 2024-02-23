// Импорт класса Card из файла './Card'
import Card from './Card';

// Экспорт класса Form по умолчанию
export default class Form {
  constructor() {
    // Создание элемента формы
    this.element = document.createElement('form');
    // Добавление класса 'form' к элементу формы
    this.element.classList.add('form');
    // Вставка HTML-разметки в элемент формы
    this.element.innerHTML = `
    <textarea type="text" class="card-input" placeholder="Enter a  title for this card..." required></textarea>
    <div class="buttons">
      <button class="btn-add-card">Add Card</button>
      <button class="btn-cancel">Cancel</button>
    </div>`;
    // Получение ссылок на элементы формы
    this.inputEl = this.element.querySelector('.card-input');
    this.btnCancelEl = this.element.querySelector('.btn-cancel');
    // Привязка контекста для обработчиков событий
    this.onSubmit = this.onSubmit.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    // Добавление обработчиков событий
    this.element.addEventListener('submit', this.onSubmit);
    this.btnCancelEl.addEventListener('click', this.onClickCancel);
    // Инициализация свойств обработчиков
    this.addCardHandler = null;
    this.cancelHandler = null;
  }

  // Метод обработки события отправки формы
  onSubmit(e) {
    e.preventDefault();
    // Создание новой карточки с текстом из поля ввода
    const card = new Card(this.inputEl.value);
    // Вызов обработчика добавления карточки и передача ему созданной карточки
    this.addCardHandler(card);
    // Вызов обработчика отмены
    this.cancelHandler();
  }

  // Метод обработки события клика по кнопке "Cancel"
  onClickCancel(e) {
    e.preventDefault();
    // Вызов обработчика отмены
    this.cancelHandler();
  }

  // Метод очистки формы
  clear() {
    this.element.reset();
  }
}