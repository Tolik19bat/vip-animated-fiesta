// Функция инициализации Drag and Drop
export default function initDnD(parentEl, arrayColumns) {
  // Переменные для отслеживания состояния перетаскивания
  let actualElement; // Текущий перетаскиваемый элемент
  let parentBefore; // Родительская колонка до перетаскивания
  let parentAfter; // Родительская колонка после перетаскивания
  let differenceX; // Разница между координатами X мыши и левым краем элемента
  let differenceY; // Разница между координатами Y мыши и верхним краем элемента

  // Событие на закрытие страницы для сохранения данных в локальное хранилище
  window.onunload = () => {
    const dataArray = [];
    arrayColumns.forEach((column) => {
      dataArray.push(column.getCardTexts());
    });
    const jsonDataArray = JSON.stringify(dataArray);
    localStorage.setItem('Trello', jsonDataArray);
  };

  // Событие на загрузку документа для восстановления состояния колонок из локального хранилища
  document.addEventListener('DOMContentLoaded', () => {
    const dataArray = JSON.parse(localStorage.getItem('Trello'));
    if (dataArray.length !== arrayColumns.length) {
      return; // Если длина данных не совпадает с количеством колонок, выходим из функции
    }
    for (let i = 0; i < dataArray.length; i += 1) {
      arrayColumns[i].setData(dataArray[i]);
    }
  });

  // Событие при нажатии кнопки мыши на родительский элемент
  parentEl.addEventListener('mousedown', (e) => {
    if ([...e.target.classList].includes('card')) {
      e.preventDefault(); // Предотвращаем стандартное поведение браузера
      actualElement = e.target;
      parentBefore = actualElement.closest('.column').cloneNode(true);
      parentAfter = actualElement.closest('.column');
      const { left, top } = actualElement.getBoundingClientRect();
      actualElement.classList.add('dragged');
      differenceX = e.clientX - left;
      differenceY = e.clientY - top;
      // Добавляем обработчики событий мыши
      document.documentElement.addEventListener('mouseup', onMouseUp);
      document.documentElement.addEventListener('mousemove', onMouseMove);
    }
  });

  // Функция обработки движения мыши
  const onMouseMove = (e) => {
    e.preventDefault();
    actualElement.style.left = `${e.clientX - differenceX}px`;
    actualElement.style.top = `${e.clientY - differenceY}px`;
    arrayColumns.forEach((column) => {
      if (isCursorOnElem(e, column)) {
        column.onMouseMove(e, actualElement);
      } else {
        column.onMouseMove(e, null);
      }
    });
  };

  // Функция проверки, находится ли курсор над элементом
  const isCursorOnElem = (ev, column) => {
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    const {
      left, right, top, bottom,
    } = column.element.getBoundingClientRect();
    return mouseX > left && mouseX < right && mouseY > top && mouseY < bottom;
  };

  // Функция для получения колонки, над которой находится курсор
  const getColumnWithCursor = (e) => arrayColumns.find((column) => isCursorOnElem(e, column));

  // Функция при отпускании кнопки мыши
  const onMouseUp = (e) => {
    e.preventDefault();
    if (!getColumnWithCursor(e)) {
      parentAfter.replaceWith(parentBefore);
      actualElement.remove();
    }
    arrayColumns.forEach((column) => {
      if (isCursorOnElem(e, column)) {
        column.onMouseUp(true);
      } else {
        column.onMouseUp(false);
      }
    });
    // Удаляем обработчики событий мыши
    document.documentElement.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeEventListener('mousemove', onMouseMove);
    actualElement.classList.remove('dragged');
    actualElement = undefined; // Сбрасываем переменную текущего элемента
  };
}
