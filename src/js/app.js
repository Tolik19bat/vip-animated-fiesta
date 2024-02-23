// Импорт классов Column и initDnD из соответствующих файлов
import Column from './Column';
import initDnD from './initDnD';

// Получение ссылок на элементы колонок
const firstColumnEl = document.querySelector('.first-column');
const secondColumnEl = document.querySelector('.second-column');
const thirdColumnEl = document.querySelector('.third-column');

// Создание экземпляров колонок
const firstColumn = new Column(firstColumnEl);
const secondColumn = new Column(secondColumnEl);
const thirdColumn = new Column(thirdColumnEl);

// Получение ссылки на родительский элемент, содержащий все колонки
const parentEl = document.querySelector('.main-container');

// Инициализация Drag and Drop для всех колонок
initDnD(parentEl, [firstColumn, secondColumn, thirdColumn]);