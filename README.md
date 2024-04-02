# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Базовый код
- абстрактный класс Component<T> - основа для VIEW компонентов, 
содержит: 
  - toggleClass - метод для добавления/удаления классов, 
  - setText - метод для записи текстового содержимого элемента,
  - setDisabled - метод для блокировки элемента, 
  - setVisible, setHidden - методы для работы с видимостью элементов,
  - setImage - метод для записи ссылки на изображение и его текстового описания,
  - render - метод для рендера элемента на странице;

- абстрактный класс Model<T> - базовая модель, чтобы можно было отличить ее от простых объектов с данными,
содержит метод фиксирующий изменение модели;

- класс Api - класс, описывающий взаимодействие с сервером 
(методы get, post, проверка на статус ответа handleResponse);

- класс EventEmitter - брокер событий, позволяет подписываться на события и уведомлять подписчиков
  о наступлении события: 
  - on, off, emit - подписка, отписка, уведомление о наступлении события,
  - onAll, offAll - подписка на все события, сброс всех подписчиков,
  - trigger - генерация заданного события с заданными аргументами.

## Model
- ProductModel - модель данных товара, наследует Model содержит поля и методы:
  - id - идентификационный номер товара;
  - description - описание товара;
  - image - изображение;
  - title - название товара;
  - category - наименование категории товара;
  - price - цена товара;
  - productId - геттер, возвращает id;
  - productDescription - геттер, возвращает description;
  - productImage - геттер, возвращает image;
  - productTitle - геттер, возвращает title;
  - productCategory - геттер, возвращает category;
  - productPrice - геттер, возвращает price;

- CatalogModel - модель каталога товаров, наследует Model содержит поля и методы:
  - total - количество товаров в каталоге;
  - items - массив объектов с данными о товарах;
  - totalAmount - геттер, возвращает total;
  - itemsInCatalog - геттер, возвращает items;

- UserDataModel - модель данных пользователя, наследует Model, содержит поля и методы:
  - payment - метод оплаты;
  - email - почта;
  - phone - номер телефона;
  - address - адрес доставки;
  - items - массив id товаров, добавленных в корзину;
  - total - стоимость заказа;
  - paymentMethod - геттер, возвращает payment;
  - emailValue - геттер, возвращает email;
  - phoneNumber - геттер, возвращает phone;
  - deliveryAddress - геттер, возвращает address;
  - totalPrice - геттер, возвращает total;
  - itemsInOrder - геттер, возвращает items;

- ShoppingCartModel - модель корзины, наследует Model, содержит поля и методы:
  - items - массив id товаров, добавленных в корзину;
  - total - стоимость заказа;
  - itemsInCart - геттер, возвращает items;
  - totalPrice - геттер, возвращает totalPrice;
  - addItem - принимает инфорацию о карточке, добавляет id в items;
  - deleteItem - принимает инфорацию о карточке, ищет id в items и удаляет его;

## View
- класс PageView - страница, наследует Component, содержит поля и методы:
  - _counter - количество товаров в корзине;
  - _catalog - каталог товаров;
  - _wrapper - обертка страницы;
  - _shoppingCart - корзина;
  - counter - сеттер значения кол-ва товаров в корзине;
  - catalog - сеттер для карточек товаров в каталоге;
  - locked - сеттер класса для page с фиксированным позиционированием;
  
- класс CardView - карточка товара, наследует Component, содержит поля и методы:
  - _title - название товара;
  - _image - изображение карточки;
  - _description - описание товара;
  - _button - кнопка добавления в корзину;
  - _price - цена товара;
  - _category - категория товара;
  - id - сеттер/геттер для data-атрибута карточки товара;
  - title - сеттер/геттер для текстового содержимого названия;
  - price - сеттер/геттер для текстового содержимого цены;
  - image - сеттер/геттер для ссылки на изображение;
  - description - сеттер/геттер для текстового содержимого описания;
  - category - сеттер для категории карточки, принимает текстовое содержимое категории и цвет, 
  в зависимости от данных присваивает элементу класс;

- класс ModalView - модальное окно, наследует Component, содержит поля и методы:
  - _closeButton - кнопка закрытия модального окна;
  - _content - контент модального окна;
  - content - сеттер для контента (карточка товара, корзина, форма, успешное оформление заказа);
  - open - метод открытия модльного окна, присваивает класс, отслеживает событие;
  - close - метод закрытия модльного окна, убирает класс, отслеживает событие;
  - render - метод отображения модального окна на странице;

- класс SuccessView - успешное оформление заказа, наследует Component, содержит содержит поля и методы:
  - _close - кнопка "За новыми покупками!", закрывающая модальное окно;

- класс ShoppingCartView - корзина, наследует Component, содержит поля и методы:
  - _list - массив карточек товаров;
  - _total - стоимость заказа;
  - _button - кнопка 'Оформить';
  - items - сеттер, если массив items пустой - создает параграф с текстом 'Корзина пуста', если нет - выводит элементы ;
  - totalPrice - сеттер текстового значения стоимости заказа;

- класс FormView<T> - форма, наследует Component, содержит поля и методы:
  - _submit - кнопка сохранения данных;
  - _errors - отображения ошибок при заполнении формы;
  - onInputChange - метод, отслеживающий изменение значения формы;
  - valid - сеттер для блока кнопки _submit в зависимости от значения валидации;
  - errors - сеттер для текстового значения ошибок;
  - render - метод рендера формы;

- класс OrderView - заказ в целом, наследует Form, содержит поля и методы:
  - phone - сеттер для номера телефона;
  - email - сеттер для адреса электронной почты;
  - address - сеттер для адреса доставки;
  - payment - сеттер для метода оплаты, переключает классы у кнопок при клике;

## Основные типы данных
- Данные карточки товара
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

- Данные списка товаров
```
interface IProductList {
  total: number;
  items: IProduct[];
}
```

- Данные корзины
```
interface IShoppingCart {
  items: IProduct[];
  totalPrice: number;
  addItem(cardInfo: IProduct): void;
  deleteItem(cardInfo: IProduct): void;
}
```

-  Данные форм
```
interface IOrderForm {
   payment: Payment;
   email: string;
   phone: string;
   address: string;
}
```

- Данные заказа
```
interface IOrder extends IOrderForm {
  total: number;
  items: IProduct[];
}
```

- Результирующие данные заказа
```
interface IOrderResult extends ApiListResponse<IProduct>{
  id: string;
}
```

- Данные успешного заказа
```
interface ISuccess {
  total: number;
  id: string;
}
```

- Данные модалки 
```
interface IModalData {
  content: HTMLElement;
}
```

## Сервисный класс
- класс LarekApi - класс для взаимодействия с сервером, GET запросы для списка товаров и информации
об одном товаре, а также POST запрос для заказа;

## События
- order:submit - подтверждение заказа;
- formErrors:change - изменение состояния валидации формы;
- modal:open - модальное окно открыто;
- modal:close - модальное окно закрыто;
- shoppingCart:open - открыта корзина;
- card:open - открыта карточка товара;
- order:open - открыта форма заказа;