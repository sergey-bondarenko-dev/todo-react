# Todo React

Небольшое SPA для управления списком задач. Проект используется как учебное приложение для отработки архитектуры React-приложения, серверного состояния, маршрутизации, типизации и оптимизации клиентского бандла.

Демо: https://sergey-bondarenko-dev.github.io/todo-react

## Возможности

- добавление, выполнение и удаление задач;
- удаление всех задач с подтверждением;
- поиск с регистронезависимой и безопасной HTML-подсветкой совпадений;
- статистика выполненных задач;
- прокрутка к первой незавершённой задаче;
- отдельная страница задачи по маршруту `/tasks/:id`;
- обработка неизвестных маршрутов;
- анимация добавления и удаления элементов;
- два источника данных: `json-server` и `localStorage`.

## Стек

- React 19 и TypeScript;
- Vite 7;
- React Router 8;
- Redux Toolkit, RTK Query и React Redux;
- Motion с `LazyMotion`;
- SCSS Modules;
- ESLint и Stylelint;
- json-server;
- gh-pages;
- rollup-plugin-visualizer.

## Архитектура

Код организован по принципам, близким к Feature-Sliced Design:

```text
src/
├── app/       # store, маршрутизация и глобальные стили
├── pages/     # страницы списка и отдельной задачи
├── widgets/   # композиция основного Todo-интерфейса
├── features/  # добавление, поиск и статистика
├── entities/  # RTK Query API и UI задачи
└── shared/    # API-адаптеры, UI-kit, типы, утилиты и ресурсы
```

Компоненты не работают с хранилищем данных напрямую. Они используют сгенерированные RTK Query hooks, а endpoints обращаются к единому `taskRepository`. Репозиторий выбирает серверную или локальную реализацию через переменную окружения.

## Ключевые решения

### Серверное состояние через RTK Query

`tasksApi` описывает запросы списка и отдельной задачи, а также мутации добавления, переключения состояния и удаления. Кэш обновляется через теги `Task` и `LIST`: после успешной мутации RTK Query инвалидирует нужные данные и повторно запрашивает их.

В Redux store зарегистрированы reducer и middleware RTK Query. Локальными React-состояниями остаются только UI-данные, например поисковая строка и значение формы.

### React Router и GitHub Pages

Приложение использует declarative API React Router:

- `/` — список задач;
- `/tasks/:id` — подробности задачи;
- `*` — страница 404.

`BrowserRouter` получает `basename` из `import.meta.env.BASE_URL`. Production-сборка использует `/todo-react`, поэтому маршруты корректно работают в подпапке GitHub Pages. Перед деплоем `index.html` копируется в `404.html`, чтобы прямые переходы на вложенные маршруты возвращали SPA.

### Два режима хранения данных

По умолчанию приложение обращается к `json-server` по адресу `http://localhost:3001/tasks`.

Если `VITE_STATIC_BACKEND=true`, используется адаптер `localStorage`. Оба адаптера реализуют один контракт `TasksApi`, поэтому RTK Query и UI не зависят от способа хранения. В `.env.production` статический режим включён автоматически.

### Безопасная подсветка поиска

Перед передачей строки в `dangerouslySetInnerHTML` текст задачи экранируется как HTML, а поисковый запрос — как часть регулярного выражения. После этого найденные фрагменты оборачиваются в `<mark>`.

### Анимация и размер бандла

Добавление и удаление `TodoItem` анимируются через `AnimatePresence` и облегчённый компонент `m`. Удаление начинается только после успешной мутации: RTK Query обновляет список, а `AnimatePresence` удерживает DOM-узел до завершения exit-анимации.

Вместо полного `motion` используется `LazyMotion` с динамически импортируемым `domAnimation`. Это выносит animation features в отдельный чанк и уменьшает начальный JavaScript. Настройка `prefers-reduced-motion` учитывается через Motion hook и глобальные стили.

Для просмотра состава бандла используется интерактивный treemap с raw, gzip и Brotli-размерами:

```bash
npm run build:analyze
```

Отчёт создаётся в `dist/stats.html`. Обычная production-сборка визуализатор не подключает.

## Требования

- Node.js 22.22 или новее;
- npm.

## Установка и запуск

Установить зависимости:

```bash
npm install
```

Для разработки с HTTP API запустите два процесса.

Терминал 1:

```bash
npm run server
```

Терминал 2:

```bash
npm run dev
```

Dev-сервер будет доступен по адресу, который выведет Vite. json-server запускается на `http://localhost:3001`.

### Запуск без json-server

PowerShell:

```powershell
$env:VITE_STATIC_BACKEND='true'; npm run dev
```

Linux/macOS:

```bash
VITE_STATIC_BACKEND=true npm run dev
```

В этом режиме задачи сохраняются в `localStorage` текущего браузера.

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Запустить Vite dev server |
| `npm run server` | Запустить json-server на порту 3001 |
| `npm run build` | Собрать production-версию |
| `npm run build:analyze` | Собрать приложение и создать `dist/stats.html` |
| `npm run preview` | Локально открыть production-сборку |
| `npm run typecheck` | Проверить TypeScript |
| `npm run lint` | Проверить TypeScript/TSX через ESLint |
| `npm run lint:styles` | Проверить CSS/SCSS через Stylelint |
| `npm run deploy` | Собрать и опубликовать приложение через gh-pages |

## Проверка перед изменениями

```bash
npm run typecheck
npm run lint
npm run lint:styles
npm run build
```

## Что можно улучшить

- добавить отображение сетевых ошибок и состояния загрузки основного списка;
- проверять `response.ok` и унифицировать ошибки серверного и локального адаптеров;
- добавить unit-тесты для RTK Query endpoints, API-адаптеров и подсветки;
- добавить component/e2e-тесты основных пользовательских сценариев;
- удалить оставшиеся неиспользуемые hooks и URL-утилиты после завершения миграций;
- добавить optimistic updates или undo для изменения и удаления задач.
