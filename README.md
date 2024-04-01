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
- класс PageView - наследует Component, содержит поля: 
  - счетчик кол-ва товаров в корзине,
  - каталог товаров, 
  - обертка, которая блокирует страницу при открытии модального окна,
  - корзина,
а также методы-сеттеры данных полей;
  
- класс CardView - наследует Component, содержит защищенные поля 
(название, изображение, описание, кнопка, цена, категория), а также 
соответствующие геттеры и сеттеры;

- класс ModalView - наследует Component, содержит поля closeButton, content, методы 
открытия/закрытия, метод установки контента, рендер;

- класс SuccessView - наследует Component, содержит защищенное поле 'закрыть',
представленное HTML элементом (в UI - кнопка 'За новыми покупками'), в конструкторе
прописан eventListener по клику;

- класс ShoppingCartView - наследует Component, содержит защищенные поля списка товаров,
суммы заказа, кнопки оформления заказа, а также сеттеры для суммы заказа и обновления содержимого list, 
методы добавления/удаления из корзины товаров;

- класс FormView - наследует Component, содержит поле submit, errors, методы валидации,
отображения ошибок, рендер, а также метод, фиксирующий изменение содержания инпута;

- класс OrderView - наследует Form, класс для информации о заказе, содержит сеттеры для ;
телефона, почты и адреса.

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