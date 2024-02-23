// Импорт классов Form и Card из соответствующих файлов
import Form from './Form';
import Card from './Card';

// Экспорт класса Column по умолчанию
export default class Column {
  constructor(element) {
    // Элемент колонки
    this.element = element;
    // Кнопка "Add" в колонке
    this.btnAddEl = this.element.querySelector('.btn-add');
    // Привязка контекста для обработчика события
    this.onClickAdd = this.onClickAdd.bind(this);
    // Добавление обработчика события на кнопку "Add"
    this.btnAddEl.addEventListener('click', this.onClickAdd);
    // Создание экземпляра формы
    this.form = new Form();
    // Привязка метода к скрытию формы
    this.hideForm = this.hideForm.bind(this);
    // Установка обработчика отмены формы
    this.form.cancelHandler = this.hideForm;
    // Установка обработчика добавления карточки
    this.addCard = this.addCard.bind(this);
    // Установка обработчика добавления карточки из формы
    this.form.addCardHandler = this.addCard;
    // Переменные для перетаскивания карточек
    this.insertionZone = null;
    this.insertElement = null;
    this.newCardContainerEl = null;
    // Привязка контекста для обработчика события перемещения мыши
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  // Обработчик события клика по кнопке "Add"
  onClickAdd() {
    // Скрытие кнопки "Add"
    this.btnAddEl.classList.add('hidden');
    // Добавление формы в колонку
    this.element.appendChild(this.form.element);
  }

  // Метод скрытия формы
  hideForm() {
    // Очистка формы
    this.form.clear();
    // Удаление формы из колонки
    this.element.querySelector('.form').remove();
    // Показ кнопки "Add"
    this.btnAddEl.classList.remove('hidden');
  }

  // Метод добавления карточки в колонку
  addCard(card) {
    // Создание контейнера для карточки
    const cardContainerEl = document.createElement('div');
    cardContainerEl.classList.add('card-container');
    // Добавление карточки в контейнер
    cardContainerEl.appendChild(card.element);
    // Вставка контейнера в начало колонки
    this.element.insertAdjacentElement('afterbegin', cardContainerEl);
  }

  // Метод удаления пустого контейнера
  removeEmptyContainer() {
    const elements = this.getArrayCardContainers();
    const elementWithoutChildren = elements.find(
      (el) => el.children.length === 0,
    );
    if (elementWithoutChildren) {
      elementWithoutChildren.remove();
    }
    if (this.newCardContainerEl) {
      this.newCardContainerEl.remove();
    }
  }

  // Метод обработки события перемещения мыши
  onMouseMove(e, insElement) {
    if (!insElement && this.insertElement === insElement) {
      return;
    }
    if (!insElement && this.insertElement !== insElement) {
      this.insertElement = insElement;
      this.removeEmptyContainer();
      this.insertionZone = null;
      return;
    }
    if (insElement) {
      const containerEl = insElement.closest('.card-container');
      if (containerEl) {
        containerEl.replaceWith(insElement);
      }
      this.insertElement = insElement;
      const insertionZone = this.getInsertionZone(e);
      if (this.insertionZone === insertionZone) {
        return;
      }
      this.insertionZone = insertionZone;
      this.removeEmptyContainer();
      this.addContainer();
    }
  }

  // Метод определения зоны для вставки карточки
  getInsertionZone(e) {
    const mouseY = e.clientY;
    const cardEls = this.getArrayCardContainers();
    if (cardEls.length === 0) {
      return 0;
    }
    for (let i = 0; i <= cardEls.length; i += 1) {
      let upperLimit;
      let bottomLimit;

      if (i === 0) {
        upperLimit = this.element.getBoundingClientRect().top;
        const { top, bottom } = cardEls[i].getBoundingClientRect();
        bottomLimit = (top + bottom) / 2;
      } else if (i === cardEls.length) {
        const { top: previousTop, bottom: previousBottom } = cardEls[i - 1].getBoundingClientRect();
        upperLimit = (previousTop + previousBottom) / 2;
        bottomLimit = this.element.getBoundingClientRect().bottom;
      } else {
        const { top: previousTop, bottom: previousBottom } = cardEls[i - 1].getBoundingClientRect();
        upperLimit = (previousTop + previousBottom) / 2;
        const { top, bottom } = cardEls[i].getBoundingClientRect();
        bottomLimit = (top + bottom) / 2;
      }

      if (mouseY >= upperLimit && mouseY < bottomLimit) {
        return i;
      }
    }
  }

  // Метод добавления нового контейнера для карточки
  addContainer() {
    this.newCardContainerEl = document.createElement('div');
    this.newCardContainerEl.classList.add('new-card-container');
    this.newCardContainerEl.style.height = `${this.insertElement.offsetHeight}px`;
    const cardContainerEls = this.getArrayCardContainers();
    if (cardContainerEls.length === 0 || this.insertionZone === 0) {
      this.element.insertAdjacentElement('afterbegin', this.newCardContainerEl);
      return;
    }
    try {
      cardContainerEls[this.insertionZone - 1].insertAdjacentElement(
        'afterend',
        this.newCardContainerEl,
      );
    } catch (e) {
      console.error(e);
      console.log('this.insertionZone - 1: ', this.insertionZone - 1);
      console.log(
        'cardContainerEls[this.insertionZone - 1]: ',
        cardContainerEls[this.insertionZone - 1],
      );
    }
  }

  // Метод обработки события отпускания мыши
  onMouseUp(presenceСursor) {
    if (presenceСursor) {
      if (this.newCardContainerEl) {
        this.newCardContainerEl.appendChild(this.insertElement);
        this.insertElement.style.cssText = '';
        this.newCardContainerEl.classList.remove('new-card-container');
        this.newCardContainerEl.classList.add('card-container');
        this.newCardContainerEl.style.cssText = '';
      }
    }
    delete this.newCardContainerEl;
    delete this.insertionZone;
    delete this.insertElement;
  }

  // Метод получения массива контейнеров для карточек
  getArrayCardContainers() {
    return [...this.element.querySelectorAll('.card-container')];
  }

  // Метод получения текстов карточек
  getCardTexts() {
    const arrayCardTexts = [];
    this.getArrayCardContainers().forEach((el) => {
      arrayCardTexts.push(el.querySelector('.card').textContent);
    });
    return arrayCardTexts;
  }

  // Метод установки данных карточек в колонку
  setData(dataArray) {
    for (let i = dataArray.length - 1; i >= 0; i -= 1) {
      const card = new Card(dataArray[i]);
      this.addCard(card);
    }
  }
}