import { Code, FileText, Megaphone, Search, BarChart3, Lightbulb, PenTool, MessageSquare, Briefcase, GraduationCap, Palette, Rocket, Bug, Database, Shield, Target, TrendingUp, Users, Zap, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Template {
  id: string;
  title: string;
  titleRu: string;
  titleUa: string;
  description: string;
  descriptionRu: string;
  descriptionUa: string;
  icon: LucideIcon;
  example: string;
  exampleRu: string;
  exampleUa: string;
  defaultInput: string;
  defaultInputRu: string;
  defaultInputUa: string;
  category: TemplateCategory;
}

export type TemplateCategory = "programming" | "marketing" | "copywriting" | "analytics" | "business" | "education";

export interface CategoryInfo {
  id: TemplateCategory;
  label: string;
  labelRu: string;
  labelUa: string;
  icon: LucideIcon;
  color: string;
}

export const categories: CategoryInfo[] = [
  { id: "programming", label: "Programming", labelRu: "Программирование", labelUa: "Програмування", icon: Code, color: "text-blue-400" },
  { id: "marketing", label: "Marketing", labelRu: "Маркетинг", labelUa: "Маркетинг", icon: Megaphone, color: "text-orange-400" },
  { id: "copywriting", label: "Copywriting", labelRu: "Копирайтинг", labelUa: "Копірайтинг", icon: PenTool, color: "text-purple-400" },
  { id: "analytics", label: "Analytics", labelRu: "Аналитика", labelUa: "Аналітика", icon: BarChart3, color: "text-green-400" },
  { id: "business", label: "Business", labelRu: "Бизнес", labelUa: "Бізнес", icon: Briefcase, color: "text-yellow-400" },
  { id: "education", label: "Education", labelRu: "Образование", labelUa: "Освіта", icon: GraduationCap, color: "text-pink-400" },
];

export const templates: Template[] = [
  // ==================== PROGRAMMING ====================
  {
    id: "code-review",
    title: "Senior Code Review",
    titleRu: "Экспертное код-ревью",
    titleUa: "Експертне код-ревʼю",
    description: "Deep architectural analysis with SOLID principles, performance optimization, security audit, and actionable refactoring recommendations",
    descriptionRu: "Глубокий архитектурный анализ с принципами SOLID, оптимизация производительности, аудит безопасности и конкретные рекомендации по рефакторингу",
    descriptionUa: "Глибокий архітектурний аналіз з принципами SOLID, оптимізація продуктивності, аудит безпеки та конкретні рекомендації з рефакторингу",
    icon: Code,
    example: "React component with state management, API calls, and complex rendering logic",
    exampleRu: "React компонент с управлением состоянием, API-вызовами и сложной логикой рендеринга",
    exampleUa: "React компонент з управлінням станом, API-викликами та складною логікою рендерингу",
    defaultInput: `Act as a Senior Software Architect with 15+ years of experience. Perform a comprehensive code review covering:

**ARCHITECTURE ANALYSIS:**
- Evaluate adherence to SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- Assess design patterns usage and suggest improvements
- Identify code coupling and cohesion issues
- Review module boundaries and separation of concerns

**PERFORMANCE OPTIMIZATION:**
- Identify memory leaks and unnecessary re-renders
- Analyze time/space complexity of algorithms (Big O notation)
- Suggest caching strategies and lazy loading opportunities
- Review database query efficiency if applicable

**SECURITY AUDIT:**
- Check for common vulnerabilities (XSS, SQL injection, CSRF)
- Review authentication/authorization implementation
- Identify sensitive data exposure risks
- Assess input validation and sanitization

**CODE QUALITY:**
- Evaluate naming conventions and code readability
- Identify dead code and redundant logic
- Check error handling completeness
- Assess test coverage opportunities

**DELIVERABLES:**
1. Priority-ranked list of issues (Critical/High/Medium/Low)
2. Specific code snippets showing before/after improvements
3. Architectural diagram if structure changes are recommended

Code to review:`,
    defaultInputRu: `Действуй как Senior Software Architect с 15+ летним опытом. Проведи комплексное код-ревью, охватывающее:

**АРХИТЕКТУРНЫЙ АНАЛИЗ:**
- Оцени соблюдение принципов SOLID (единственная ответственность, открытость/закрытость, подстановка Лисков, разделение интерфейса, инверсия зависимостей)
- Оцени использование паттернов проектирования и предложи улучшения
- Выяви проблемы связанности и сцепленности кода
- Проанализируй границы модулей и разделение ответственностей

**ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ:**
- Найди утечки памяти и лишние ререндеры
- Проанализируй сложность алгоритмов по времени/памяти (нотация Big O)
- Предложи стратегии кэширования и ленивой загрузки
- Проверь эффективность запросов к БД если применимо

**АУДИТ БЕЗОПАСНОСТИ:**
- Проверь на типичные уязвимости (XSS, SQL-инъекции, CSRF)
- Оцени реализацию аутентификации/авторизации
- Выяви риски раскрытия конфиденциальных данных
- Оцени валидацию и санитизацию ввода

**КАЧЕСТВО КОДА:**
- Оцени соглашения об именовании и читаемость
- Найди мёртвый код и избыточную логику
- Проверь полноту обработки ошибок
- Определи возможности для покрытия тестами

**РЕЗУЛЬТАТЫ:**
1. Приоритизированный список проблем (Критично/Высоко/Средне/Низко)
2. Конкретные сниппеты кода с показом до/после улучшений
3. Архитектурная диаграмма если нужны структурные изменения

Код для ревью:`,
    defaultInputUa: `Дій як Senior Software Architect з 15+ роками досвіду. Проведи комплексне код-ревʼю, що охоплює:

**АРХІТЕКТУРНИЙ АНАЛІЗ:**
- Оціни дотримання принципів SOLID (єдина відповідальність, відкритість/закритість, підстановка Лісков, розділення інтерфейсу, інверсія залежностей)
- Оціни використання патернів проектування та запропонуй покращення
- Виявити проблеми звʼязаності та зчепленості коду
- Проаналізуй межі модулів та розділення відповідальностей

**ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ:**
- Знайди витоки памʼяті та зайві ререндери
- Проаналізуй складність алгоритмів за часом/памʼяттю (нотація Big O)
- Запропонуй стратегії кешування та лінивого завантаження
- Перевір ефективність запитів до БД якщо застосовно

**АУДИТ БЕЗПЕКИ:**
- Перевір на типові вразливості (XSS, SQL-інʼєкції, CSRF)
- Оціни реалізацію автентифікації/авторизації
- Виявити ризики розкриття конфіденційних даних
- Оціни валідацію та санітизацію вводу

**ЯКІСТЬ КОДУ:**
- Оціни угоди про іменування та читабельність
- Знайди мертвий код та надлишкову логіку
- Перевір повноту обробки помилок
- Визнач можливості для покриття тестами

**РЕЗУЛЬТАТИ:**
1. Пріоритизований список проблем (Критично/Високо/Середньо/Низько)
2. Конкретні сніпети коду з показом до/після покращень
3. Архітектурна діаграма якщо потрібні структурні зміни

Код для ревʼю:`,
    category: "programming",
  },
  {
    id: "debug-helper",
    title: "Expert Debugging Assistant",
    titleRu: "Экспертный помощник отладки",
    titleUa: "Експертний помічник налагодження",
    description: "Systematic root cause analysis with stack trace interpretation, reproduction steps, and verified fix implementations",
    descriptionRu: "Систематический анализ первопричин с интерпретацией стек-трейсов, шагами воспроизведения и верифицированными исправлениями",
    descriptionUa: "Систематичний аналіз першопричин з інтерпретацією стек-трейсів, кроками відтворення та верифікованими виправленнями",
    icon: Bug,
    example: "TypeError: Cannot read properties of undefined (reading 'map') in useEffect",
    exampleRu: "TypeError: Cannot read properties of undefined (reading 'map') в useEffect",
    exampleUa: "TypeError: Cannot read properties of undefined (reading 'map') в useEffect",
    defaultInput: `Act as a Senior Debugging Specialist. Apply systematic debugging methodology:

**PHASE 1 - SYMPTOM ANALYSIS:**
- Parse error messages and stack traces
- Identify error type (syntax, runtime, logic, async, memory)
- Determine affected code paths and components
- Classify severity and impact scope

**PHASE 2 - HYPOTHESIS GENERATION:**
- List 3-5 probable root causes ranked by likelihood
- For each hypothesis, explain the causal mechanism
- Identify what evidence would confirm/refute each

**PHASE 3 - ROOT CAUSE INVESTIGATION:**
- Trace data flow backward from failure point
- Check state mutations and race conditions
- Verify API contracts and type expectations
- Examine edge cases and boundary conditions

**PHASE 4 - SOLUTION IMPLEMENTATION:**
- Provide exact code fix with explanation
- Include defensive programming additions
- Add appropriate error handling
- Suggest unit tests to prevent regression

**PHASE 5 - PREVENTION:**
- Identify patterns that led to this bug
- Recommend linting rules or type constraints
- Suggest architectural improvements

**OUTPUT FORMAT:**
1. 🔴 Error Summary (one sentence)
2. 🎯 Root Cause (with technical explanation)
3. ✅ Fix (complete code with comments)
4. 🛡️ Prevention Strategy

Bug/Error to debug:`,
    defaultInputRu: `Действуй как Senior Debugging Specialist. Применяй систематическую методологию отладки:

**ФАЗА 1 - АНАЛИЗ СИМПТОМОВ:**
- Разбери сообщения об ошибках и стек-трейсы
- Определи тип ошибки (синтаксическая, рантайм, логическая, асинхронная, память)
- Определи затронутые пути кода и компоненты
- Классифицируй серьёзность и масштаб влияния

**ФАЗА 2 - ГЕНЕРАЦИЯ ГИПОТЕЗ:**
- Перечисли 3-5 вероятных первопричин по убыванию вероятности
- Для каждой гипотезы объясни причинный механизм
- Укажи, какие доказательства подтвердят/опровергнут каждую

**ФАЗА 3 - РАССЛЕДОВАНИЕ ПЕРВОПРИЧИНЫ:**
- Проследи поток данных обратно от точки сбоя
- Проверь мутации состояния и race conditions
- Верифицируй контракты API и ожидания типов
- Исследуй граничные случаи и условия

**ФАЗА 4 - РЕАЛИЗАЦИЯ РЕШЕНИЯ:**
- Предоставь точное исправление кода с объяснением
- Включи добавления защитного программирования
- Добавь соответствующую обработку ошибок
- Предложи юнит-тесты для предотвращения регрессии

**ФАЗА 5 - ПРЕДОТВРАЩЕНИЕ:**
- Определи паттерны, приведшие к этому багу
- Рекомендуй правила линтера или ограничения типов
- Предложи архитектурные улучшения

**ФОРМАТ ВЫВОДА:**
1. 🔴 Краткое описание ошибки (одно предложение)
2. 🎯 Первопричина (с техническим объяснением)
3. ✅ Исправление (полный код с комментариями)
4. 🛡️ Стратегия предотвращения

Баг/Ошибка для отладки:`,
    defaultInputUa: `Дій як Senior Debugging Specialist. Застосовуй систематичну методологію налагодження:

**ФАЗА 1 - АНАЛІЗ СИМПТОМІВ:**
- Розбери повідомлення про помилки та стек-трейси
- Визнач тип помилки (синтаксична, рантайм, логічна, асинхронна, памʼять)
- Визнач задіяні шляхи коду та компоненти
- Класифікуй серйозність та масштаб впливу

**ФАЗА 2 - ГЕНЕРАЦІЯ ГІПОТЕЗ:**
- Перелічи 3-5 ймовірних першопричин за спаданням ймовірності
- Для кожної гіпотези поясни причинний механізм
- Вкажи, які докази підтвердять/спростують кожну

**ФАЗА 3 - РОЗСЛІДУВАННЯ ПЕРШОПРИЧИНИ:**
- Простежи потік даних назад від точки збою
- Перевір мутації стану та race conditions
- Верифікуй контракти API та очікування типів
- Дослідж граничні випадки та умови

**ФАЗА 4 - РЕАЛІЗАЦІЯ РІШЕННЯ:**
- Надай точне виправлення коду з поясненням
- Включи додавання захисного програмування
- Додай відповідну обробку помилок
- Запропонуй юніт-тести для запобігання регресії

**ФАЗА 5 - ЗАПОБІГАННЯ:**
- Визнач патерни, що призвели до цього багу
- Рекомендуй правила лінтера або обмеження типів
- Запропонуй архітектурні покращення

**ФОРМАТ ВИВОДУ:**
1. 🔴 Короткий опис помилки (одне речення)
2. 🎯 Першопричина (з технічним поясненням)
3. ✅ Виправлення (повний код з коментарями)
4. 🛡️ Стратегія запобігання

Баг/Помилка для налагодження:`,
    category: "programming",
  },
  {
    id: "api-design",
    title: "Enterprise API Architect",
    titleRu: "Архитектор Enterprise API",
    titleUa: "Архітектор Enterprise API",
    description: "Production-grade API design with OpenAPI specs, authentication flows, rate limiting, versioning, and comprehensive error handling",
    descriptionRu: "Продакшен-уровень проектирования API с OpenAPI спецификациями, аутентификацией, rate limiting, версионированием и обработкой ошибок",
    descriptionUa: "Продакшен-рівень проектування API з OpenAPI специфікаціями, автентифікацією, rate limiting, версіонуванням та обробкою помилок",
    icon: Database,
    example: "E-commerce platform with user management, products, orders, and payments",
    exampleRu: "E-commerce платформа с управлением пользователями, продуктами, заказами и платежами",
    exampleUa: "E-commerce платформа з управлінням користувачами, продуктами, замовленнями та платежами",
    defaultInput: `Act as an Enterprise API Architect. Design a production-ready API with:

**RESOURCE MODELING:**
- Define entities with complete attributes and relationships
- Apply proper RESTful resource naming conventions
- Design URL hierarchy reflecting resource relationships
- Specify HTTP methods for each operation (GET, POST, PUT, PATCH, DELETE)

**ENDPOINT SPECIFICATION:**
For each endpoint provide:
- Complete URL path with path parameters
- Query parameters for filtering, sorting, pagination
- Request body schema with validation rules
- Response schemas for success (200, 201, 204) and errors
- Required headers (Authorization, Content-Type, Accept)

**AUTHENTICATION & AUTHORIZATION:**
- OAuth 2.0 / JWT implementation details
- Role-based access control (RBAC) matrix
- API key management strategy
- Token refresh and revocation flows

**PERFORMANCE & SCALABILITY:**
- Rate limiting rules per endpoint/user tier
- Caching strategy (ETags, Cache-Control headers)
- Pagination approach (cursor vs offset)
- Bulk operation endpoints for batch processing

**ERROR HANDLING:**
- Consistent error response format
- Standard HTTP status codes usage
- Machine-readable error codes
- Human-readable error messages
- Validation error details format

**VERSIONING STRATEGY:**
- URL path vs header-based versioning
- Deprecation policy and timeline
- Breaking vs non-breaking changes handling

**DELIVERABLES:**
1. Complete OpenAPI 3.0 specification (YAML)
2. Entity relationship diagram
3. Authentication flow diagram
4. Rate limit and quota table

Design API for:`,
    defaultInputRu: `Действуй как Enterprise API Architect. Спроектируй продакшен-готовый API с:

**МОДЕЛИРОВАНИЕ РЕСУРСОВ:**
- Определи сущности с полными атрибутами и связями
- Применяй правильные соглашения именования RESTful
- Спроектируй иерархию URL, отражающую связи ресурсов
- Укажи HTTP методы для каждой операции (GET, POST, PUT, PATCH, DELETE)

**СПЕЦИФИКАЦИЯ ЭНДПОИНТОВ:**
Для каждого эндпоинта предоставь:
- Полный URL путь с path параметрами
- Query параметры для фильтрации, сортировки, пагинации
- Схему тела запроса с правилами валидации
- Схемы ответов для успеха (200, 201, 204) и ошибок
- Обязательные заголовки (Authorization, Content-Type, Accept)

**АУТЕНТИФИКАЦИЯ И АВТОРИЗАЦИЯ:**
- Детали реализации OAuth 2.0 / JWT
- Матрица ролевого контроля доступа (RBAC)
- Стратегия управления API ключами
- Флоу обновления и отзыва токенов

**ПРОИЗВОДИТЕЛЬНОСТЬ И МАСШТАБИРУЕМОСТЬ:**
- Правила rate limiting по эндпоинту/уровню пользователя
- Стратегия кэширования (ETags, Cache-Control заголовки)
- Подход к пагинации (cursor vs offset)
- Эндпоинты массовых операций

**ОБРАБОТКА ОШИБОК:**
- Консистентный формат ответа об ошибке
- Стандартное использование HTTP статус-кодов
- Машиночитаемые коды ошибок
- Человекочитаемые сообщения об ошибках
- Формат деталей валидационных ошибок

**СТРАТЕГИЯ ВЕРСИОНИРОВАНИЯ:**
- Версионирование через URL vs заголовки
- Политика и сроки устаревания
- Обработка ломающих vs неломающих изменений

**РЕЗУЛЬТАТЫ:**
1. Полная спецификация OpenAPI 3.0 (YAML)
2. Диаграмма связей сущностей
3. Диаграмма флоу аутентификации
4. Таблица rate limit и квот

Спроектируй API для:`,
    defaultInputUa: `Дій як Enterprise API Architect. Спроектуй продакшен-готовий API з:

**МОДЕЛЮВАННЯ РЕСУРСІВ:**
- Визнач сутності з повними атрибутами та звʼязками
- Застосовуй правильні угоди іменування RESTful
- Спроектуй ієрархію URL, що відображає звʼязки ресурсів
- Вкажи HTTP методи для кожної операції (GET, POST, PUT, PATCH, DELETE)

**СПЕЦИФІКАЦІЯ ЕНДПОІНТІВ:**
Для кожного ендпоінту надай:
- Повний URL шлях з path параметрами
- Query параметри для фільтрації, сортування, пагінації
- Схему тіла запиту з правилами валідації
- Схеми відповідей для успіху (200, 201, 204) та помилок
- Обовʼязкові заголовки (Authorization, Content-Type, Accept)

**АВТЕНТИФІКАЦІЯ ТА АВТОРИЗАЦІЯ:**
- Деталі реалізації OAuth 2.0 / JWT
- Матриця рольового контролю доступу (RBAC)
- Стратегія управління API ключами
- Флоу оновлення та відкликання токенів

**ПРОДУКТИВНІСТЬ ТА МАСШТАБОВАНІСТЬ:**
- Правила rate limiting по ендпоінту/рівню користувача
- Стратегія кешування (ETags, Cache-Control заголовки)
- Підхід до пагінації (cursor vs offset)
- Ендпоінти масових операцій

**ОБРОБКА ПОМИЛОК:**
- Консистентний формат відповіді про помилку
- Стандартне використання HTTP статус-кодів
- Машиночитабельні коди помилок
- Людиночитабельні повідомлення про помилки
- Формат деталей валідаційних помилок

**СТРАТЕГІЯ ВЕРСІОНУВАННЯ:**
- Версіонування через URL vs заголовки
- Політика та терміни застарівання
- Обробка ломаючих vs неломаючих змін

**РЕЗУЛЬТАТИ:**
1. Повна специфікація OpenAPI 3.0 (YAML)
2. Діаграма звʼязків сутностей
3. Діаграма флоу автентифікації
4. Таблиця rate limit та квот

Спроектуй API для:`,
    category: "programming",
  },
  {
    id: "system-architecture",
    title: "System Design Blueprint",
    titleRu: "Проектирование системной архитектуры",
    titleUa: "Проектування системної архітектури",
    description: "Complete system architecture with microservices, databases, caching, message queues, and cloud infrastructure recommendations",
    descriptionRu: "Полная системная архитектура с микросервисами, базами данных, кэшированием, очередями сообщений и рекомендациями по облачной инфраструктуре",
    descriptionUa: "Повна системна архітектура з мікросервісами, базами даних, кешуванням, чергами повідомлень та рекомендаціями щодо хмарної інфраструктури",
    icon: Rocket,
    example: "Real-time collaborative document editor like Google Docs for 1M users",
    exampleRu: "Редактор совместной работы в реальном времени как Google Docs для 1М пользователей",
    exampleUa: "Редактор спільної роботи в реальному часі як Google Docs для 1М користувачів",
    defaultInput: `Act as a Principal Systems Architect. Design a complete system architecture addressing:

**REQUIREMENTS ANALYSIS:**
- Functional requirements breakdown
- Non-functional requirements (latency, throughput, availability)
- Scale estimations (users, requests/sec, data volume)
- Consistency vs availability trade-offs (CAP theorem)

**HIGH-LEVEL ARCHITECTURE:**
- Service decomposition strategy (monolith vs microservices)
- Communication patterns (sync REST, async messaging, gRPC)
- API Gateway and service mesh considerations
- Load balancing strategy

**DATA ARCHITECTURE:**
- Database selection rationale (SQL vs NoSQL vs NewSQL)
- Data partitioning and sharding strategy
- Replication and consistency model
- Caching layers (L1, L2, CDN)
- Data backup and recovery plan

**INFRASTRUCTURE:**
- Cloud provider recommendations (AWS/GCP/Azure)
- Compute options (containers, serverless, VMs)
- Networking and security groups
- Auto-scaling policies
- Multi-region/multi-AZ deployment

**RELIABILITY:**
- Failure modes analysis
- Circuit breaker patterns
- Retry and timeout strategies
- Health checks and monitoring
- Incident response runbooks

**OBSERVABILITY:**
- Logging strategy (structured logs, aggregation)
- Metrics collection (custom and infrastructure)
- Distributed tracing implementation
- Alerting thresholds and escalation

**SECURITY:**
- Authentication/authorization architecture
- Secrets management
- Encryption (at rest, in transit)
- Network security and WAF

**DELIVERABLES:**
1. Architecture diagram (components and data flow)
2. Technology stack recommendations with justification
3. Capacity planning spreadsheet
4. Cost estimation (monthly/annually)
5. Implementation roadmap (phases)

Design system for:`,
    defaultInputRu: `Действуй как Principal Systems Architect. Спроектируй полную системную архитектуру, охватывая:

**АНАЛИЗ ТРЕБОВАНИЙ:**
- Разбивка функциональных требований
- Нефункциональные требования (латентность, пропускная способность, доступность)
- Оценки масштаба (пользователи, запросов/сек, объём данных)
- Компромиссы согласованности vs доступности (теорема CAP)

**ВЫСОКОУРОВНЕВАЯ АРХИТЕКТУРА:**
- Стратегия декомпозиции сервисов (монолит vs микросервисы)
- Паттерны коммуникации (синхронный REST, асинхронный messaging, gRPC)
- API Gateway и service mesh соображения
- Стратегия балансировки нагрузки

**АРХИТЕКТУРА ДАННЫХ:**
- Обоснование выбора БД (SQL vs NoSQL vs NewSQL)
- Стратегия партиционирования и шардинга
- Модель репликации и согласованности
- Слои кэширования (L1, L2, CDN)
- План бэкапа и восстановления данных

**ИНФРАСТРУКТУРА:**
- Рекомендации по облачному провайдеру (AWS/GCP/Azure)
- Опции вычислений (контейнеры, serverless, VMs)
- Сеть и группы безопасности
- Политики автомасштабирования
- Развёртывание multi-region/multi-AZ

**НАДЁЖНОСТЬ:**
- Анализ режимов отказа
- Паттерны circuit breaker
- Стратегии повторов и таймаутов
- Health checks и мониторинг
- Runbooks реагирования на инциденты

**НАБЛЮДАЕМОСТЬ:**
- Стратегия логирования (структурированные логи, агрегация)
- Сбор метрик (кастомные и инфраструктурные)
- Реализация распределённой трассировки
- Пороги алертинга и эскалация

**БЕЗОПАСНОСТЬ:**
- Архитектура аутентификации/авторизации
- Управление секретами
- Шифрование (at rest, in transit)
- Сетевая безопасность и WAF

**РЕЗУЛЬТАТЫ:**
1. Архитектурная диаграмма (компоненты и потоки данных)
2. Рекомендации по технологическому стеку с обоснованием
3. Таблица планирования ёмкости
4. Оценка затрат (месячно/годово)
5. Roadmap реализации (фазы)

Спроектируй систему для:`,
    defaultInputUa: `Дій як Principal Systems Architect. Спроектуй повну системну архітектуру, охоплюючи:

**АНАЛІЗ ВИМОГ:**
- Розбивка функціональних вимог
- Нефункціональні вимоги (латентність, пропускна здатність, доступність)
- Оцінки масштабу (користувачі, запитів/сек, обсяг даних)
- Компроміси узгодженості vs доступності (теорема CAP)

**ВИСОКОРІВНЕВА АРХІТЕКТУРА:**
- Стратегія декомпозиції сервісів (моноліт vs мікросервіси)
- Патерни комунікації (синхронний REST, асинхронний messaging, gRPC)
- API Gateway та service mesh міркування
- Стратегія балансування навантаження

**АРХІТЕКТУРА ДАНИХ:**
- Обґрунтування вибору БД (SQL vs NoSQL vs NewSQL)
- Стратегія партиціонування та шардингу
- Модель реплікації та узгодженості
- Шари кешування (L1, L2, CDN)
- План бекапу та відновлення даних

**ІНФРАСТРУКТУРА:**
- Рекомендації щодо хмарного провайдера (AWS/GCP/Azure)
- Опції обчислень (контейнери, serverless, VMs)
- Мережа та групи безпеки
- Політики автомасштабування
- Розгортання multi-region/multi-AZ

**НАДІЙНІСТЬ:**
- Аналіз режимів відмови
- Патерни circuit breaker
- Стратегії повторів та таймаутів
- Health checks та моніторинг
- Runbooks реагування на інциденти

**СПОСТЕРЕЖУВАНІСТЬ:**
- Стратегія логування (структуровані логи, агрегація)
- Збір метрик (кастомні та інфраструктурні)
- Реалізація розподіленого трейсингу
- Пороги алертингу та ескалація

**БЕЗПЕКА:**
- Архітектура автентифікації/авторизації
- Управління секретами
- Шифрування (at rest, in transit)
- Мережева безпека та WAF

**РЕЗУЛЬТАТИ:**
1. Архітектурна діаграма (компоненти та потоки даних)
2. Рекомендації щодо технологічного стеку з обґрунтуванням
3. Таблиця планування ємності
4. Оцінка витрат (місячно/річно)
5. Roadmap реалізації (фази)

Спроектуй систему для:`,
    category: "programming",
  },

  // ==================== MARKETING ====================
  {
    id: "ad-campaign",
    title: "Full-Funnel Ad Campaign",
    titleRu: "Полноворонковая рекламная кампания",
    titleUa: "Повноворонкова рекламна кампанія",
    description: "Complete multi-channel ad strategy with audience targeting, creative variations, A/B testing framework, and performance benchmarks",
    descriptionRu: "Полная мультиканальная рекламная стратегия с таргетингом аудитории, вариациями креативов, A/B тестированием и бенчмарками",
    descriptionUa: "Повна мультиканальна рекламна стратегія з таргетингом аудиторії, варіаціями креативів, A/B тестуванням та бенчмарками",
    icon: Target,
    example: "SaaS productivity app launching to compete with Notion for small business teams",
    exampleRu: "SaaS приложение для продуктивности, конкурирующее с Notion для команд малого бизнеса",
    exampleUa: "SaaS додаток для продуктивності, що конкурує з Notion для команд малого бізнесу",
    defaultInput: `Act as a Performance Marketing Director with $10M+ campaign experience. Create a comprehensive ad campaign:

**STRATEGIC FOUNDATION:**
- Define campaign objectives (awareness, consideration, conversion)
- Establish KPIs with target values (CAC, ROAS, CTR, CPA)
- Set budget allocation across channels and funnel stages
- Define campaign timeline with key milestones

**AUDIENCE ARCHITECTURE:**
For each funnel stage, define:
- Demographic targeting (age, gender, income, education)
- Psychographic profiles (interests, values, lifestyle)
- Behavioral signals (purchase behavior, device usage)
- Lookalike audience sources and percentages
- Retargeting pools with recency windows

**CHANNEL STRATEGY:**
For each channel (Meta, Google, LinkedIn, TikTok, etc.):
- Campaign structure (campaigns, ad sets, ads)
- Bidding strategy recommendations
- Placement optimization
- Budget distribution rationale

**CREATIVE FRAMEWORK:**
Provide for each funnel stage:
- 3 headline variations with character counts
- 3 primary text variations with hooks
- Visual concept descriptions (static, video, carousel)
- Call-to-action recommendations
- Emotional triggers to leverage

**A/B TESTING PLAN:**
- Variables to test in priority order
- Sample size calculations
- Test duration recommendations
- Success criteria definitions
- Learning agenda

**LANDING PAGE REQUIREMENTS:**
- Above-the-fold elements
- Social proof placement
- Form field recommendations
- Mobile optimization priorities
- Page speed requirements

**MEASUREMENT FRAMEWORK:**
- Attribution model recommendation
- Conversion tracking setup
- Custom event definitions
- Reporting dashboard KPIs
- Optimization checkpoints

Create campaign for:`,
    defaultInputRu: `Действуй как Performance Marketing Director с опытом кампаний на $10M+. Создай комплексную рекламную кампанию:

**СТРАТЕГИЧЕСКИЙ ФУНДАМЕНТ:**
- Определи цели кампании (осведомлённость, рассмотрение, конверсия)
- Установи KPI с целевыми значениями (CAC, ROAS, CTR, CPA)
- Распредели бюджет по каналам и стадиям воронки
- Определи таймлайн кампании с ключевыми вехами

**АРХИТЕКТУРА АУДИТОРИИ:**
Для каждой стадии воронки определи:
- Демографический таргетинг (возраст, пол, доход, образование)
- Психографические профили (интересы, ценности, стиль жизни)
- Поведенческие сигналы (покупательское поведение, устройства)
- Источники похожих аудиторий и проценты
- Пулы ретаргетинга с окнами давности

**КАНАЛЬНАЯ СТРАТЕГИЯ:**
Для каждого канала (Meta, Google, LinkedIn, TikTok и др.):
- Структура кампании (кампании, группы объявлений, объявления)
- Рекомендации по стратегии ставок
- Оптимизация размещений
- Обоснование распределения бюджета

**КРЕАТИВНЫЙ ФРЕЙМВОРК:**
Для каждой стадии воронки предоставь:
- 3 вариации заголовков с подсчётом символов
- 3 вариации основного текста с хуками
- Описания визуальных концепций (статика, видео, карусель)
- Рекомендации по call-to-action
- Эмоциональные триггеры для использования

**ПЛАН A/B ТЕСТИРОВАНИЯ:**
- Переменные для тестирования в порядке приоритета
- Расчёты размера выборки
- Рекомендации по длительности теста
- Определения критериев успеха
- Повестка обучения

**ТРЕБОВАНИЯ К ЛЕНДИНГУ:**
- Элементы выше сгиба
- Размещение социальных доказательств
- Рекомендации по полям формы
- Приоритеты мобильной оптимизации
- Требования к скорости страницы

**ФРЕЙМВОРК ИЗМЕРЕНИЯ:**
- Рекомендация модели атрибуции
- Настройка отслеживания конверсий
- Определения кастомных событий
- KPI дашборда отчётности
- Контрольные точки оптимизации

Создай кампанию для:`,
    defaultInputUa: `Дій як Performance Marketing Director з досвідом кампаній на $10M+. Створи комплексну рекламну кампанію:

**СТРАТЕГІЧНИЙ ФУНДАМЕНТ:**
- Визнач цілі кампанії (обізнаність, розгляд, конверсія)
- Встанови KPI з цільовими значеннями (CAC, ROAS, CTR, CPA)
- Розподіли бюджет по каналах та стадіях воронки
- Визнач таймлайн кампанії з ключовими віхами

**АРХІТЕКТУРА АУДИТОРІЇ:**
Для кожної стадії воронки визнач:
- Демографічний таргетинг (вік, стать, дохід, освіта)
- Психографічні профілі (інтереси, цінності, стиль життя)
- Поведінкові сигнали (купівельна поведінка, пристрої)
- Джерела схожих аудиторій та відсотки
- Пули ретаргетингу з вікнами давності

**КАНАЛЬНА СТРАТЕГІЯ:**
Для кожного каналу (Meta, Google, LinkedIn, TikTok та ін.):
- Структура кампанії (кампанії, групи оголошень, оголошення)
- Рекомендації щодо стратегії ставок
- Оптимізація розміщень
- Обґрунтування розподілу бюджету

**КРЕАТИВНИЙ ФРЕЙМВОРК:**
Для кожної стадії воронки надай:
- 3 варіації заголовків з підрахунком символів
- 3 варіації основного тексту з хуками
- Описи візуальних концепцій (статика, відео, карусель)
- Рекомендації щодо call-to-action
- Емоційні тригери для використання

**ПЛАН A/B ТЕСТУВАННЯ:**
- Змінні для тестування в порядку пріоритету
- Розрахунки розміру вибірки
- Рекомендації щодо тривалості тесту
- Визначення критеріїв успіху
- Порядок денний навчання

**ВИМОГИ ДО ЛЕНДИНГУ:**
- Елементи вище згину
- Розміщення соціальних доказів
- Рекомендації щодо полів форми
- Пріоритети мобільної оптимізації
- Вимоги до швидкості сторінки

**ФРЕЙМВОРК ВИМІРЮВАННЯ:**
- Рекомендація моделі атрибуції
- Налаштування відстеження конверсій
- Визначення кастомних подій
- KPI дашборду звітності
- Контрольні точки оптимізації

Створи кампанію для:`,
    category: "marketing",
  },
  {
    id: "email-sequence",
    title: "Conversion Email Sequence",
    titleRu: "Конверсионная email-цепочка",
    titleUa: "Конверсійна email-послідовність",
    description: "Psychology-driven email sequences with optimal timing, subject line testing, and behavioral triggers for maximum engagement",
    descriptionRu: "Email-последовательности на основе психологии с оптимальным таймингом, тестированием тем и поведенческими триггерами",
    descriptionUa: "Email-послідовності на основі психології з оптимальним таймінгом, тестуванням тем та поведінковими тригерами",
    icon: MessageSquare,
    example: "7-day onboarding sequence for a project management SaaS with free trial",
    exampleRu: "7-дневная онбординг-цепочка для SaaS управления проектами с бесплатным триалом",
    exampleUa: "7-денна онбординг-послідовність для SaaS управління проектами з безкоштовним тріалом",
    defaultInput: `Act as an Email Marketing Strategist who has generated $50M+ in email revenue. Design a complete email sequence:

**SEQUENCE ARCHITECTURE:**
- Define sequence goal and success metrics
- Map subscriber journey and decision points
- Establish entry triggers and exit conditions
- Set optimal send times based on industry data

**FOR EACH EMAIL, PROVIDE:**

**Email #[N] - [Theme/Purpose]**
Timing: [Trigger/delay from previous]

Subject Lines (3 variations for A/B testing):
1. [Primary - curiosity-driven]
2. [Urgency/scarcity-based]
3. [Benefit-focused]

Preview Text: [40-90 characters that complement subject]

**Email Body Structure:**
- Opening hook (pattern interrupt)
- Problem agitation
- Solution positioning
- Social proof element
- Clear CTA with button text
- P.S. line with secondary hook

**Technical Specifications:**
- Personalization tokens to use
- Dynamic content blocks (if applicable)
- Link tracking parameters
- Unsubscribe placement

**BEHAVIORAL TRIGGERS:**
- Branch conditions (opened/clicked/purchased)
- Re-engagement logic for non-openers
- Upgrade/upsell trigger points

**DELIVERABILITY OPTIMIZATION:**
- Spam trigger words to avoid
- Image-to-text ratio recommendation
- Mobile optimization requirements
- Sender name and reply-to setup

**TESTING FRAMEWORK:**
- Subject line test methodology
- Send time optimization
- CTA placement tests
- Sequence length tests

**EXPECTED METRICS:**
- Open rate targets by email position
- Click rate benchmarks
- Conversion rate goals
- List health indicators

Create email sequence for:`,
    defaultInputRu: `Действуй как Email Marketing Strategist, сгенерировавший $50M+ email-выручки. Создай полную email-последовательность:

**АРХИТЕКТУРА ПОСЛЕДОВАТЕЛЬНОСТИ:**
- Определи цель последовательности и метрики успеха
- Составь карту пути подписчика и точек принятия решений
- Установи триггеры входа и условия выхода
- Задай оптимальное время отправки на основе данных индустрии

**ДЛЯ КАЖДОГО ПИСЬМА ПРЕДОСТАВЬ:**

**Email #[N] - [Тема/Цель]**
Тайминг: [Триггер/задержка от предыдущего]

Темы письма (3 варианта для A/B теста):
1. [Основная - на любопытстве]
2. [На срочности/дефиците]
3. [Фокус на выгоде]

Превью-текст: [40-90 символов, дополняющих тему]

**Структура тела письма:**
- Открывающий хук (прерывание паттерна)
- Усиление проблемы
- Позиционирование решения
- Элемент социального доказательства
- Чёткий CTA с текстом кнопки
- P.S. строка со вторичным хуком

**Технические спецификации:**
- Токены персонализации для использования
- Динамические блоки контента (если применимо)
- Параметры отслеживания ссылок
- Размещение отписки

**ПОВЕДЕНЧЕСКИЕ ТРИГГЕРЫ:**
- Условия ветвления (открыл/кликнул/купил)
- Логика повторного вовлечения для неоткрывших
- Точки триггера апгрейда/апселла

**ОПТИМИЗАЦИЯ ДОСТАВЛЯЕМОСТИ:**
- Спам-слова для избегания
- Рекомендации по соотношению картинок к тексту
- Требования мобильной оптимизации
- Настройка имени отправителя и reply-to

**ФРЕЙМВОРК ТЕСТИРОВАНИЯ:**
- Методология тестирования тем
- Оптимизация времени отправки
- Тесты размещения CTA
- Тесты длины последовательности

**ОЖИДАЕМЫЕ МЕТРИКИ:**
- Целевые open rate по позиции письма
- Бенчмарки click rate
- Цели conversion rate
- Индикаторы здоровья списка

Создай email-последовательность для:`,
    defaultInputUa: `Дій як Email Marketing Strategist, що згенерував $50M+ email-виручки. Створи повну email-послідовність:

**АРХІТЕКТУРА ПОСЛІДОВНОСТІ:**
- Визнач ціль послідовності та метрики успіху
- Склади карту шляху підписника та точок прийняття рішень
- Встанови тригери входу та умови виходу
- Задай оптимальний час відправки на основі даних індустрії

**ДЛЯ КОЖНОГО ЛИСТА НАДАЙ:**

**Email #[N] - [Тема/Ціль]**
Таймінг: [Тригер/затримка від попереднього]

Теми листа (3 варіанти для A/B тесту):
1. [Основна - на цікавості]
2. [На терміновості/дефіциті]
3. [Фокус на вигоді]

Превʼю-текст: [40-90 символів, що доповнюють тему]

**Структура тіла листа:**
- Відкриваючий хук (переривання патерну)
- Посилення проблеми
- Позиціонування рішення
- Елемент соціального доказу
- Чіткий CTA з текстом кнопки
- P.S. рядок з вторинним хуком

**Технічні специфікації:**
- Токени персоналізації для використання
- Динамічні блоки контенту (якщо застосовно)
- Параметри відстеження посилань
- Розміщення відписки

**ПОВЕДІНКОВІ ТРИГЕРИ:**
- Умови розгалуження (відкрив/клікнув/купив)
- Логіка повторного залучення для невідкривших
- Точки тригера апгрейду/апселлу

**ОПТИМІЗАЦІЯ ДОСТАВЛЮВАНОСТІ:**
- Спам-слова для уникання
- Рекомендації щодо співвідношення картинок до тексту
- Вимоги мобільної оптимізації
- Налаштування імені відправника та reply-to

**ФРЕЙМВОРК ТЕСТУВАННЯ:**
- Методологія тестування тем
- Оптимізація часу відправки
- Тести розміщення CTA
- Тести довжини послідовності

**ОЧІКУВАНІ МЕТРИКИ:**
- Цільові open rate за позицією листа
- Бенчмарки click rate
- Цілі conversion rate
- Індикатори здоровʼя списку

Створи email-послідовність для:`,
    category: "marketing",
  },
  {
    id: "content-strategy",
    title: "Content Marketing Strategy",
    titleRu: "Контент-маркетинговая стратегия",
    titleUa: "Контент-маркетингова стратегія",
    description: "Complete content calendar with pillar content, SEO keyword clusters, distribution channels, and repurposing workflows",
    descriptionRu: "Полный контент-календарь с пиллар-контентом, SEO-кластерами ключевых слов, каналами дистрибуции и воркфлоу перепрофилирования",
    descriptionUa: "Повний контент-календар з пілар-контентом, SEO-кластерами ключових слів, каналами дистрибуції та воркфлоу перепрофілювання",
    icon: FileText,
    example: "B2B fintech startup targeting CFOs with content about financial automation",
    exampleRu: "B2B fintech стартап, таргетирующий CFO контентом об автоматизации финансов",
    exampleUa: "B2B fintech стартап, що таргетує CFO контентом про автоматизацію фінансів",
    defaultInput: `Act as a Head of Content with experience scaling content programs from 0 to 1M monthly visitors. Create a comprehensive content strategy:

**STRATEGIC FOUNDATION:**
- Define content mission statement
- Identify 3-5 content pillars aligned with business goals
- Map content to buyer journey stages
- Establish brand voice guidelines
- Define content quality standards

**AUDIENCE RESEARCH:**
- Detailed buyer personas (3-5)
- Content consumption preferences
- Information sources and influencers
- Pain points and questions at each stage
- Objections to address through content

**SEO KEYWORD STRATEGY:**
- 5 pillar topics with search volume
- Keyword clusters for each pillar (10-15 keywords)
- Content type mapping (blog, guide, tool, video)
- Difficulty vs opportunity analysis
- Featured snippet opportunities

**CONTENT CALENDAR (90 days):**
For each piece of content:
- Title and format
- Target keyword and search intent
- Buyer stage (awareness/consideration/decision)
- Production complexity (low/medium/high)
- Distribution channels
- KPIs and success metrics

**CONTENT FORMATS MIX:**
- Long-form pillar content specifications
- Blog post templates and guidelines
- Video content briefs
- Infographic concepts
- Interactive tools/calculators
- Case study framework

**DISTRIBUTION STRATEGY:**
- Owned channels (blog, email, social)
- Earned channels (PR, guest posts, podcasts)
- Paid amplification guidelines
- Syndication partnerships
- Community engagement tactics

**REPURPOSING WORKFLOW:**
- Pillar content → atomization map
- Format conversion matrix
- Platform-specific adaptation guidelines
- User-generated content integration

**MEASUREMENT FRAMEWORK:**
- Traffic and engagement KPIs
- Lead generation metrics
- Content scoring methodology
- Attribution model
- Reporting cadence and format

Create content strategy for:`,
    defaultInputRu: `Действуй как Head of Content с опытом масштабирования контент-программ от 0 до 1M ежемесячных посетителей. Создай комплексную контент-стратегию:

**СТРАТЕГИЧЕСКИЙ ФУНДАМЕНТ:**
- Определи миссию контента
- Выяви 3-5 контент-пиларов, соответствующих бизнес-целям
- Сопоставь контент со стадиями пути покупателя
- Установи гайдлайны голоса бренда
- Определи стандарты качества контента

**ИССЛЕДОВАНИЕ АУДИТОРИИ:**
- Детальные персоны покупателей (3-5)
- Предпочтения потребления контента
- Источники информации и инфлюенсеры
- Болевые точки и вопросы на каждой стадии
- Возражения для проработки через контент

**SEO СТРАТЕГИЯ КЛЮЧЕВЫХ СЛОВ:**
- 5 пилар-тем с объёмами поиска
- Кластеры ключевых слов для каждого пилара (10-15 ключей)
- Маппинг типов контента (блог, гайд, инструмент, видео)
- Анализ сложности vs возможности
- Возможности featured snippet

**КОНТЕНТ-КАЛЕНДАРЬ (90 дней):**
Для каждой единицы контента:
- Заголовок и формат
- Целевое ключевое слово и поисковый интент
- Стадия покупателя (осведомлённость/рассмотрение/решение)
- Сложность производства (низкая/средняя/высокая)
- Каналы дистрибуции
- KPI и метрики успеха

**МИКС ФОРМАТОВ КОНТЕНТА:**
- Спецификации длинного пилар-контента
- Шаблоны и гайдлайны блог-постов
- Брифы видеоконтента
- Концепции инфографики
- Интерактивные инструменты/калькуляторы
- Фреймворк кейс-стади

**СТРАТЕГИЯ ДИСТРИБУЦИИ:**
- Собственные каналы (блог, email, соцсети)
- Earned каналы (PR, гостевые посты, подкасты)
- Гайдлайны платного усиления
- Партнёрства по синдикации
- Тактики вовлечения сообщества

**ВОРКФЛОУ ПЕРЕПРОФИЛИРОВАНИЯ:**
- Пилар-контент → карта атомизации
- Матрица конвертации форматов
- Гайдлайны адаптации под платформы
- Интеграция пользовательского контента

**ФРЕЙМВОРК ИЗМЕРЕНИЯ:**
- KPI трафика и вовлечения
- Метрики лидогенерации
- Методология скоринга контента
- Модель атрибуции
- Каденция и формат отчётности

Создай контент-стратегию для:`,
    defaultInputUa: `Дій як Head of Content з досвідом масштабування контент-програм від 0 до 1M щомісячних відвідувачів. Створи комплексну контент-стратегію:

**СТРАТЕГІЧНИЙ ФУНДАМЕНТ:**
- Визнач місію контенту
- Виявити 3-5 контент-пілларів, що відповідають бізнес-цілям
- Співстав контент зі стадіями шляху покупця
- Встанови гайдлайни голосу бренду
- Визнач стандарти якості контенту

**ДОСЛІДЖЕННЯ АУДИТОРІЇ:**
- Детальні персони покупців (3-5)
- Переваги споживання контенту
- Джерела інформації та інфлюенсери
- Больові точки та питання на кожній стадії
- Заперечення для опрацювання через контент

**SEO СТРАТЕГІЯ КЛЮЧОВИХ СЛІВ:**
- 5 піллар-тем з обсягами пошуку
- Кластери ключових слів для кожного піллара (10-15 ключів)
- Маппінг типів контенту (блог, гайд, інструмент, відео)
- Аналіз складності vs можливості
- Можливості featured snippet

**КОНТЕНТ-КАЛЕНДАР (90 днів):**
Для кожної одиниці контенту:
- Заголовок та формат
- Цільове ключове слово та пошуковий інтент
- Стадія покупця (обізнаність/розгляд/рішення)
- Складність виробництва (низька/середня/висока)
- Канали дистрибуції
- KPI та метрики успіху

**МІКС ФОРМАТІВ КОНТЕНТУ:**
- Специфікації довгого піллар-контенту
- Шаблони та гайдлайни блог-постів
- Бріфи відеоконтенту
- Концепції інфографіки
- Інтерактивні інструменти/калькулятори
- Фреймворк кейс-стаді

**СТРАТЕГІЯ ДИСТРИБУЦІЇ:**
- Власні канали (блог, email, соцмережі)
- Earned канали (PR, гостьові пости, подкасти)
- Гайдлайни платного підсилення
- Партнерства по синдикації
- Тактики залучення спільноти

**ВОРКФЛОУ ПЕРЕПРОФІЛЮВАННЯ:**
- Піллар-контент → карта атомізації
- Матриця конвертації форматів
- Гайдлайни адаптації під платформи
- Інтеграція користувацького контенту

**ФРЕЙМВОРК ВИМІРЮВАННЯ:**
- KPI трафіку та залучення
- Метрики лідогенерації
- Методологія скорингу контенту
- Модель атрибуції
- Каденція та формат звітності

Створи контент-стратегію для:`,
    category: "marketing",
  },
  {
    id: "go-to-market",
    title: "Go-to-Market Launch Plan",
    titleRu: "GTM план запуска",
    titleUa: "GTM план запуску",
    description: "Complete product launch strategy with positioning, pricing, channel partnerships, and 90-day launch timeline",
    descriptionRu: "Полная стратегия запуска продукта с позиционированием, ценообразованием, партнёрствами и 90-дневным таймлайном",
    descriptionUa: "Повна стратегія запуску продукту з позиціонуванням, ціноутворенням, партнерствами та 90-денним таймлайном",
    icon: Rocket,
    example: "AI-powered design tool targeting freelance designers and small agencies",
    exampleRu: "AI-инструмент дизайна для фрилансеров и небольших агентств",
    exampleUa: "AI-інструмент дизайну для фрілансерів та невеликих агентств",
    defaultInput: `Act as a VP of Marketing who has led 10+ successful product launches. Create a comprehensive GTM plan:

**MARKET ANALYSIS:**
- Total Addressable Market (TAM) sizing
- Serviceable Addressable Market (SAM) definition
- Serviceable Obtainable Market (SOM) targets
- Market trends and timing rationale
- Competitive landscape mapping

**POSITIONING STRATEGY:**
- Category definition/creation
- Unique value proposition (one sentence)
- Positioning statement (for internal use)
- Competitive differentiation matrix
- Messaging hierarchy (primary, secondary, proof points)

**IDEAL CUSTOMER PROFILE:**
- Firmographic criteria (industry, size, revenue)
- Technographic requirements
- Buying committee roles and personas
- Purchase triggers and urgency drivers
- Deal qualification criteria

**PRICING STRATEGY:**
- Pricing model selection (subscription, usage, hybrid)
- Tier structure with feature differentiation
- Pricing psychology tactics
- Competitor price benchmarking
- Discount and negotiation guidelines

**CHANNEL STRATEGY:**
- Direct sales motion design
- Self-serve product-led growth funnel
- Partner channel development
- Marketplace strategy (if applicable)
- Channel conflict mitigation

**LAUNCH PHASES:**

Phase 1: Pre-Launch (Weeks 1-4)
- Beta program design
- Influencer/analyst briefings
- Waitlist building tactics
- PR embargo and timing

Phase 2: Launch Week
- Launch day choreography (hour by hour)
- Press release and media outreach
- Social media campaign
- Email blast sequences
- Product Hunt / community launches

Phase 3: Post-Launch (Weeks 5-12)
- Momentum building activities
- Customer success stories
- Performance optimization
- Expansion campaigns

**SUCCESS METRICS:**
- Launch week targets (signups, revenue, press)
- 30/60/90 day milestones
- Leading vs lagging indicators
- Attribution and measurement setup

Create GTM plan for:`,
    defaultInputRu: `Действуй как VP of Marketing, проведший 10+ успешных запусков продуктов. Создай комплексный GTM план:

**АНАЛИЗ РЫНКА:**
- Оценка Total Addressable Market (TAM)
- Определение Serviceable Addressable Market (SAM)
- Цели Serviceable Obtainable Market (SOM)
- Тренды рынка и обоснование тайминга
- Маппинг конкурентного ландшафта

**СТРАТЕГИЯ ПОЗИЦИОНИРОВАНИЯ:**
- Определение/создание категории
- Уникальное ценностное предложение (одно предложение)
- Заявление о позиционировании (для внутреннего использования)
- Матрица конкурентной дифференциации
- Иерархия сообщений (первичные, вторичные, доказательства)

**ПРОФИЛЬ ИДЕАЛЬНОГО КЛИЕНТА:**
- Фирмографические критерии (индустрия, размер, выручка)
- Технографические требования
- Роли и персоны закупочного комитета
- Триггеры покупки и драйверы срочности
- Критерии квалификации сделки

**СТРАТЕГИЯ ЦЕНООБРАЗОВАНИЯ:**
- Выбор модели ценообразования (подписка, usage, гибридная)
- Структура тарифов с дифференциацией функций
- Тактики психологии ценообразования
- Бенчмаркинг цен конкурентов
- Гайдлайны по скидкам и переговорам

**КАНАЛЬНАЯ СТРАТЕГИЯ:**
- Дизайн прямых продаж
- Self-serve воронка product-led growth
- Развитие партнёрского канала
- Стратегия маркетплейсов (если применимо)
- Митигация канального конфликта

**ФАЗЫ ЗАПУСКА:**

Фаза 1: Пре-лонч (Недели 1-4)
- Дизайн бета-программы
- Брифинги инфлюенсеров/аналитиков
- Тактики наращивания вейтлиста
- PR эмбарго и тайминг

Фаза 2: Неделя запуска
- Хореография дня запуска (по часам)
- Пресс-релиз и работа со СМИ
- Кампания в соцсетях
- Последовательности email-рассылок
- Запуски на Product Hunt / в сообществах

Фаза 3: Пост-лонч (Недели 5-12)
- Активности по наращиванию импульса
- Истории успеха клиентов
- Оптимизация перформанса
- Кампании расширения

**МЕТРИКИ УСПЕХА:**
- Цели недели запуска (регистрации, выручка, пресса)
- Вехи 30/60/90 дней
- Опережающие vs запаздывающие индикаторы
- Настройка атрибуции и измерения

Создай GTM план для:`,
    defaultInputUa: `Дій як VP of Marketing, що провів 10+ успішних запусків продуктів. Створи комплексний GTM план:

**АНАЛІЗ РИНКУ:**
- Оцінка Total Addressable Market (TAM)
- Визначення Serviceable Addressable Market (SAM)
- Цілі Serviceable Obtainable Market (SOM)
- Тренди ринку та обґрунтування таймінгу
- Маппінг конкурентного ландшафту

**СТРАТЕГІЯ ПОЗИЦІОНУВАННЯ:**
- Визначення/створення категорії
- Унікальна ціннісна пропозиція (одне речення)
- Заява про позиціонування (для внутрішнього використання)
- Матриця конкурентної диференціації
- Ієрархія повідомлень (первинні, вторинні, докази)

**ПРОФІЛЬ ІДЕАЛЬНОГО КЛІЄНТА:**
- Фірмографічні критерії (індустрія, розмір, виручка)
- Технографічні вимоги
- Ролі та персони закупівельного комітету
- Тригери покупки та драйвери терміновості
- Критерії кваліфікації угоди

**СТРАТЕГІЯ ЦІНОУТВОРЕННЯ:**
- Вибір моделі ціноутворення (підписка, usage, гібридна)
- Структура тарифів з диференціацією функцій
- Тактики психології ціноутворення
- Бенчмаркінг цін конкурентів
- Гайдлайни щодо знижок та переговорів

**КАНАЛЬНА СТРАТЕГІЯ:**
- Дизайн прямих продажів
- Self-serve воронка product-led growth
- Розвиток партнерського каналу
- Стратегія маркетплейсів (якщо застосовно)
- Мітигація канального конфлікту

**ФАЗИ ЗАПУСКУ:**

Фаза 1: Пре-лонч (Тижні 1-4)
- Дизайн бета-програми
- Бріфінги інфлюенсерів/аналітиків
- Тактики нарощування вейтлисту
- PR ембарго та таймінг

Фаза 2: Тиждень запуску
- Хореографія дня запуску (погодинно)
- Прес-реліз та робота зі ЗМІ
- Кампанія в соцмережах
- Послідовності email-розсилок
- Запуски на Product Hunt / в спільнотах

Фаза 3: Пост-лонч (Тижні 5-12)
- Активності з нарощування імпульсу
- Історії успіху клієнтів
- Оптимізація перформансу
- Кампанії розширення

**МЕТРИКИ УСПІХУ:**
- Цілі тижня запуску (реєстрації, виручка, преса)
- Віхи 30/60/90 днів
- Випереджаючі vs запізнюючі індикатори
- Налаштування атрибуції та вимірювання

Створи GTM план для:`,
    category: "marketing",
  },

  // ==================== COPYWRITING ====================
  {
    id: "sales-page",
    title: "High-Converting Sales Page",
    titleRu: "Высококонверсионный лендинг продаж",
    titleUa: "Висококонверсійний лендинг продажів",
    description: "Complete sales page structure with psychological triggers, objection handling, and conversion-optimized copy blocks",
    descriptionRu: "Полная структура продающего лендинга с психологическими триггерами, обработкой возражений и конверсионным копирайтингом",
    descriptionUa: "Повна структура продаючого лендингу з психологічними тригерами, обробкою заперечень та конверсійним копірайтингом",
    icon: PenTool,
    example: "Online course teaching entrepreneurs how to build and sell digital products",
    exampleRu: "Онлайн-курс для предпринимателей по созданию и продаже цифровых продуктов",
    exampleUa: "Онлайн-курс для підприємців зі створення та продажу цифрових продуктів",
    defaultInput: `Act as a Direct Response Copywriter with $100M+ in attributed sales. Write a complete high-converting sales page:

**ABOVE THE FOLD:**
- Pre-headline (target audience qualifier)
- Main headline (big promise + curiosity)
- Sub-headline (mechanism + timeframe)
- Hero image/video concept description
- Primary CTA button text
- Social proof snippet (one powerful stat/testimonial)

**PROBLEM AGITATION:**
- "Do you recognize this?" scenario (3 pain points)
- Emotional consequences of the problem
- Failed solutions they've tried
- Why those solutions don't work
- The hidden cost of inaction

**SOLUTION INTRODUCTION:**
- "What if..." possibility painting
- Introducing the mechanism/system
- Why this approach is different
- Quick win they'll experience
- Credibility establishment

**FEATURE → BENEFIT TRANSFORMATION:**
For each major feature (5-7):
- Feature name
- What it does (functional benefit)
- What it means for them (emotional benefit)
- Proof element (testimonial/case study excerpt)

**SOCIAL PROOF SECTION:**
- 3 detailed testimonials with:
  - Before/after transformation
  - Specific results with numbers
  - Objection they had overcome
- Media logos/press mentions
- Number of customers/students served
- Industry recognition/awards

**OFFER STACK:**
- Main product/service value
- Bonus #1 with standalone value
- Bonus #2 with standalone value
- Bonus #3 with standalone value
- Total value calculation
- Your price (with justification)
- Payment plan options

**GUARANTEE:**
- Type of guarantee (money-back, results, etc.)
- Specific terms and conditions
- Why you can offer this confidently
- Risk reversal language

**OBJECTION HANDLING:**
Address these common objections:
- "I don't have time"
- "I can't afford it"
- "Will this work for me?"
- "What if I've tried similar things?"
- "I need to think about it"

**URGENCY/SCARCITY:**
- Deadline (real reason for it)
- Limited availability (if applicable)
- Price increase warning
- Bonus expiration

**FINAL CTA:**
- Summary of transformation
- Last chance messaging
- Button text (action-oriented)
- Final reassurance

**FAQ SECTION:**
- 8-10 strategic questions that address concerns

Write sales page for:`,
    defaultInputRu: `Действуй как Direct Response Copywriter с $100M+ атрибутированных продаж. Напиши полный высококонверсионный лендинг продаж:

**ВЫШЕ СГИБА:**
- Пре-заголовок (квалификатор целевой аудитории)
- Главный заголовок (большое обещание + любопытство)
- Подзаголовок (механизм + временные рамки)
- Описание концепции главного изображения/видео
- Текст основной CTA кнопки
- Сниппет социального доказательства (один мощный факт/отзыв)

**УСИЛЕНИЕ ПРОБЛЕМЫ:**
- "Вам это знакомо?" сценарий (3 болевые точки)
- Эмоциональные последствия проблемы
- Неудачные решения, которые они пробовали
- Почему эти решения не работают
- Скрытая цена бездействия

**ПРЕДСТАВЛЕНИЕ РЕШЕНИЯ:**
- "А что если..." рисование возможности
- Представление механизма/системы
- Почему этот подход отличается
- Быстрая победа, которую они испытают
- Установление доверия

**ТРАНСФОРМАЦИЯ ХАРАКТЕРИСТИКА → ВЫГОДА:**
Для каждой основной характеристики (5-7):
- Название характеристики
- Что она делает (функциональная выгода)
- Что это значит для них (эмоциональная выгода)
- Элемент доказательства (отрывок отзыва/кейса)

**СЕКЦИЯ СОЦИАЛЬНЫХ ДОКАЗАТЕЛЬСТВ:**
- 3 детальных отзыва с:
  - Трансформацией до/после
  - Конкретными результатами с цифрами
  - Возражением, которое они преодолели
- Логотипы СМИ/упоминания в прессе
- Количество обслуженных клиентов/студентов
- Признание индустрии/награды

**СТЕК ОФФЕРА:**
- Ценность основного продукта/услуги
- Бонус #1 с самостоятельной ценностью
- Бонус #2 с самостоятельной ценностью
- Бонус #3 с самостоятельной ценностью
- Расчёт общей ценности
- Ваша цена (с обоснованием)
- Варианты рассрочки

**ГАРАНТИЯ:**
- Тип гарантии (возврат денег, результат и т.д.)
- Конкретные условия
- Почему вы можете уверенно это предложить
- Язык переноса риска

**ОБРАБОТКА ВОЗРАЖЕНИЙ:**
Ответь на эти типичные возражения:
- "У меня нет времени"
- "Я не могу себе это позволить"
- "Это сработает для меня?"
- "А если я уже пробовал подобное?"
- "Мне нужно подумать"

**СРОЧНОСТЬ/ДЕФИЦИТ:**
- Дедлайн (реальная причина)
- Ограниченная доступность (если применимо)
- Предупреждение о повышении цены
- Истечение бонусов

**ФИНАЛЬНЫЙ CTA:**
- Резюме трансформации
- Последний шанс сообщение
- Текст кнопки (ориентированный на действие)
- Финальное успокоение

**СЕКЦИЯ FAQ:**
- 8-10 стратегических вопросов, отвечающих на сомнения

Напиши лендинг продаж для:`,
    defaultInputUa: `Дій як Direct Response Copywriter з $100M+ атрибутованих продажів. Напиши повний висококонверсійний лендинг продажів:

**ВИЩЕ ЗГИНУ:**
- Пре-заголовок (кваліфікатор цільової аудиторії)
- Головний заголовок (велика обіцянка + цікавість)
- Підзаголовок (механізм + часові рамки)
- Опис концепції головного зображення/відео
- Текст основної CTA кнопки
- Сніпет соціального доказу (один потужний факт/відгук)

**ПОСИЛЕННЯ ПРОБЛЕМИ:**
- "Вам це знайоме?" сценарій (3 больові точки)
- Емоційні наслідки проблеми
- Невдалі рішення, які вони пробували
- Чому ці рішення не працюють
- Прихована ціна бездіяльності

**ПРЕДСТАВЛЕННЯ РІШЕННЯ:**
- "А що якщо..." малювання можливості
- Представлення механізму/системи
- Чому цей підхід відрізняється
- Швидка перемога, яку вони відчують
- Встановлення довіри

**ТРАНСФОРМАЦІЯ ХАРАКТЕРИСТИКА → ВИГОДА:**
Для кожної основної характеристики (5-7):
- Назва характеристики
- Що вона робить (функціональна вигода)
- Що це означає для них (емоційна вигода)
- Елемент доказу (уривок відгуку/кейсу)

**СЕКЦІЯ СОЦІАЛЬНИХ ДОКАЗІВ:**
- 3 детальних відгуки з:
  - Трансформацією до/після
  - Конкретними результатами з цифрами
  - Запереченням, яке вони подолали
- Логотипи ЗМІ/згадки в пресі
- Кількість обслугованих клієнтів/студентів
- Визнання індустрії/нагороди

**СТЕК ОФЕРУ:**
- Цінність основного продукту/послуги
- Бонус #1 з самостійною цінністю
- Бонус #2 з самостійною цінністю
- Бонус #3 з самостійною цінністю
- Розрахунок загальної цінності
- Ваша ціна (з обґрунтуванням)
- Варіанти розстрочки

**ГАРАНТІЯ:**
- Тип гарантії (повернення грошей, результат тощо)
- Конкретні умови
- Чому ви можете впевнено це запропонувати
- Мова перенесення ризику

**ОБРОБКА ЗАПЕРЕЧЕНЬ:**
Відповідь на ці типові заперечення:
- "У мене немає часу"
- "Я не можу собі це дозволити"
- "Це спрацює для мене?"
- "А якщо я вже пробував подібне?"
- "Мені потрібно подумати"

**ТЕРМІНОВІСТЬ/ДЕФІЦИТ:**
- Дедлайн (реальна причина)
- Обмежена доступність (якщо застосовно)
- Попередження про підвищення ціни
- Закінчення бонусів

**ФІНАЛЬНИЙ CTA:**
- Резюме трансформації
- Останній шанс повідомлення
- Текст кнопки (орієнтований на дію)
- Фінальне заспокоєння

**СЕКЦІЯ FAQ:**
- 8-10 стратегічних питань, що відповідають на сумніви

Напиши лендинг продажів для:`,
    category: "copywriting",
  },
  {
    id: "brand-voice",
    title: "Brand Voice Guidelines",
    titleRu: "Гайдлайны голоса бренда",
    titleUa: "Гайдлайни голосу бренду",
    description: "Complete brand voice documentation with personality traits, tone spectrum, vocabulary guides, and real examples",
    descriptionRu: "Полная документация голоса бренда с чертами личности, спектром тона, словарём и реальными примерами",
    descriptionUa: "Повна документація голосу бренду з рисами особистості, спектром тону, словником та реальними прикладами",
    icon: Palette,
    example: "Sustainable fashion brand targeting eco-conscious millennials and Gen Z",
    exampleRu: "Бренд экологичной моды для эко-сознательных миллениалов и Gen Z",
    exampleUa: "Бренд екологічної моди для еко-свідомих мілленіалів та Gen Z",
    defaultInput: `Act as a Brand Strategist who has developed voice guidelines for Fortune 500 companies. Create comprehensive brand voice guidelines:

**BRAND ESSENCE:**
- Mission statement (why you exist)
- Vision statement (where you're going)
- Core values (3-5 principles)
- Brand promise (what you guarantee)
- Brand personality archetype

**VOICE ATTRIBUTES:**
Define 4-5 voice characteristics, each with:
- Attribute name
- What it means for the brand
- What it's NOT (common misinterpretation)
- Scale of 1-10 for intensity
- Example sentence demonstrating this trait

**TONE SPECTRUM:**
Create a tone matrix for different situations:
| Context | Tone Description | Example |
|---------|------------------|---------|
| Celebrating wins | [description] | [example] |
| Addressing problems | [description] | [example] |
| Educational content | [description] | [example] |
| Sales messaging | [description] | [example] |
| Crisis communication | [description] | [example] |

**VOCABULARY GUIDE:**

Words We Love (with context):
- [Word]: Why and when to use

Words We Avoid (with alternatives):
- [Word]: Why and what to say instead

Industry jargon approach:
- When to use technical terms
- When to simplify

**GRAMMAR & STYLE:**
- Sentence length preferences
- Paragraph structure
- Use of contractions
- Punctuation style (Oxford comma, exclamation marks)
- Emoji/emoticon policy
- Capitalization rules
- Number formatting

**CHANNEL-SPECIFIC ADAPTATIONS:**

For each channel, provide:
- Tone adjustments
- Length guidelines
- Formatting specifics
- Sample posts/messages

Channels:
- Website
- Email
- Social Media (per platform)
- Customer Support
- Advertising
- Internal Communications

**DO'S AND DON'TS:**
- 10 specific examples of on-brand writing
- 10 specific examples of off-brand writing (with corrections)

**WRITING EXERCISES:**
- 3 scenarios for writers to practice
- Sample briefs with model responses

Create brand voice guidelines for:`,
    defaultInputRu: `Действуй как Brand Strategist, разработавший гайдлайны голоса для компаний Fortune 500. Создай комплексные гайдлайны голоса бренда:

**СУТЬ БРЕНДА:**
- Миссия (почему вы существуете)
- Видение (куда вы идёте)
- Ключевые ценности (3-5 принципов)
- Обещание бренда (что вы гарантируете)
- Архетип личности бренда

**АТРИБУТЫ ГОЛОСА:**
Определи 4-5 характеристик голоса, каждая с:
- Название атрибута
- Что это значит для бренда
- Чем это НЕ является (типичная неправильная интерпретация)
- Шкала 1-10 для интенсивности
- Пример предложения, демонстрирующего эту черту

**СПЕКТР ТОНА:**
Создай матрицу тона для разных ситуаций:
| Контекст | Описание тона | Пример |
|----------|---------------|--------|
| Празднование побед | [описание] | [пример] |
| Решение проблем | [описание] | [пример] |
| Образовательный контент | [описание] | [пример] |
| Продающие сообщения | [описание] | [пример] |
| Кризисная коммуникация | [описание] | [пример] |

**ГАЙД ПО СЛОВАРЮ:**

Слова, которые мы любим (с контекстом):
- [Слово]: Почему и когда использовать

Слова, которых мы избегаем (с альтернативами):
- [Слово]: Почему и что говорить вместо

Подход к профессиональному жаргону:
- Когда использовать технические термины
- Когда упрощать

**ГРАММАТИКА И СТИЛЬ:**
- Предпочтения по длине предложений
- Структура параграфов
- Использование сокращений
- Стиль пунктуации
- Политика по эмодзи
- Правила капитализации
- Форматирование чисел

**АДАПТАЦИИ ПО КАНАЛАМ:**

Для каждого канала предоставь:
- Корректировки тона
- Гайдлайны по длине
- Специфику форматирования
- Примеры постов/сообщений

Каналы:
- Вебсайт
- Email
- Социальные сети (по платформам)
- Клиентская поддержка
- Реклама
- Внутренние коммуникации

**ЧТО ДЕЛАТЬ И НЕ ДЕЛАТЬ:**
- 10 конкретных примеров on-brand написания
- 10 конкретных примеров off-brand написания (с исправлениями)

**УПРАЖНЕНИЯ ПО НАПИСАНИЮ:**
- 3 сценария для практики писателей
- Примеры брифов с модельными ответами

Создай гайдлайны голоса бренда для:`,
    defaultInputUa: `Дій як Brand Strategist, що розробив гайдлайни голосу для компаній Fortune 500. Створи комплексні гайдлайни голосу бренду:

**СУТЬ БРЕНДУ:**
- Місія (чому ви існуєте)
- Бачення (куди ви йдете)
- Ключові цінності (3-5 принципів)
- Обіцянка бренду (що ви гарантуєте)
- Архетип особистості бренду

**АТРИБУТИ ГОЛОСУ:**
Визнач 4-5 характеристик голосу, кожна з:
- Назва атрибуту
- Що це означає для бренду
- Чим це НЕ є (типова неправильна інтерпретація)
- Шкала 1-10 для інтенсивності
- Приклад речення, що демонструє цю рису

**СПЕКТР ТОНУ:**
Створи матрицю тону для різних ситуацій:
| Контекст | Опис тону | Приклад |
|----------|-----------|---------|
| Святкування перемог | [опис] | [приклад] |
| Вирішення проблем | [опис] | [приклад] |
| Освітній контент | [опис] | [приклад] |
| Продаючі повідомлення | [опис] | [приклад] |
| Кризова комунікація | [опис] | [приклад] |

**ГАЙД ПО СЛОВНИКУ:**

Слова, які ми любимо (з контекстом):
- [Слово]: Чому та коли використовувати

Слова, яких ми уникаємо (з альтернативами):
- [Слово]: Чому та що говорити замість

Підхід до професійного жаргону:
- Коли використовувати технічні терміни
- Коли спрощувати

**ГРАМАТИКА ТА СТИЛЬ:**
- Переваги щодо довжини речень
- Структура параграфів
- Використання скорочень
- Стиль пунктуації
- Політика щодо емодзі
- Правила капіталізації
- Форматування чисел

**АДАПТАЦІЇ ПО КАНАЛАХ:**

Для кожного каналу надай:
- Коригування тону
- Гайдлайни щодо довжини
- Специфіку форматування
- Приклади постів/повідомлень

Канали:
- Вебсайт
- Email
- Соціальні мережі (по платформах)
- Клієнтська підтримка
- Реклама
- Внутрішні комунікації

**ЩО РОБИТИ ТА НЕ РОБИТИ:**
- 10 конкретних прикладів on-brand написання
- 10 конкретних прикладів off-brand написання (з виправленнями)

**ВПРАВИ З НАПИСАННЯ:**
- 3 сценарії для практики письменників
- Приклади бріфів з модельними відповідями

Створи гайдлайни голосу бренду для:`,
    category: "copywriting",
  },
  {
    id: "case-study",
    title: "Case Study Writer",
    titleRu: "Автор кейс-стади",
    titleUa: "Автор кейс-стаді",
    description: "Results-driven case studies with data visualization recommendations, interview questions, and multiple format outputs",
    descriptionRu: "Результато-ориентированные кейс-стади с рекомендациями по визуализации данных, вопросами интервью и разными форматами",
    descriptionUa: "Результато-орієнтовані кейс-стаді з рекомендаціями щодо візуалізації даних, питаннями інтервʼю та різними форматами",
    icon: TrendingUp,
    example: "SaaS company helped enterprise client increase sales team productivity by 40%",
    exampleRu: "SaaS компания помогла enterprise клиенту увеличить продуктивность отдела продаж на 40%",
    exampleUa: "SaaS компанія допомогла enterprise клієнту збільшити продуктивність відділу продажів на 40%",
    defaultInput: `Act as a B2B Content Writer specializing in case studies that close enterprise deals. Create a comprehensive case study:

**EXECUTIVE SUMMARY (100 words):**
- Client and industry
- Challenge in one sentence
- Solution in one sentence
- Key results (2-3 metrics)
- Timeframe

**CLIENT PROFILE:**
- Company overview
- Industry context
- Size and scale (employees, revenue, locations)
- Relevant background that makes them relatable
- Key decision makers involved (titles, not names)

**THE CHALLENGE:**
Describe the situation before:
- Business problems they faced
- Impact on operations/revenue
- Previous solutions attempted
- Why those solutions failed
- Stakes if problem wasn't solved
- Quote from client describing the pain

**THE SOLUTION:**
Implementation story:
- How they discovered your product/service
- Selection criteria and why you won
- Implementation process and timeline
- Key features/services utilized
- Integration with existing systems
- Training and adoption approach

**THE RESULTS:**
For each metric, provide:
- Before number
- After number
- Percentage improvement
- Timeframe to achieve
- Business impact in dollars (when possible)

Categories:
- Primary KPIs (directly tied to objectives)
- Secondary benefits (unexpected wins)
- Qualitative improvements

**DATA VISUALIZATION RECOMMENDATIONS:**
- Chart types for each metric
- Comparison visualizations
- Timeline graphics
- Quote callout designs

**SOCIAL PROOF ELEMENTS:**
- 3-5 pull quotes with context
- Video testimonial script (if applicable)
- Permission and approval considerations

**LESSONS LEARNED:**
- What made this implementation successful
- Advice for similar companies
- What they would do differently

**CALL TO ACTION:**
- Specific next step for readers
- Related resources to offer
- Contact information placement

**FORMAT VARIATIONS:**
Provide variations for:
- Full PDF (2-3 pages)
- One-pager summary
- Website landing page
- Social media snippets (3-5)
- Sales deck slides (3-5)

**INTERVIEW QUESTIONS:**
Provide 15-20 questions to ask the client to gather this information

Create case study for:`,
    defaultInputRu: `Действуй как B2B Content Writer, специализирующийся на кейс-стади, которые закрывают enterprise сделки. Создай комплексный кейс-стади:

**РЕЗЮМЕ ДЛЯ РУКОВОДСТВА (100 слов):**
- Клиент и индустрия
- Вызов в одном предложении
- Решение в одном предложении
- Ключевые результаты (2-3 метрики)
- Временные рамки

**ПРОФИЛЬ КЛИЕНТА:**
- Обзор компании
- Контекст индустрии
- Размер и масштаб (сотрудники, выручка, локации)
- Релевантный бэкграунд для узнаваемости
- Ключевые лица, принимающие решения (должности)

**ВЫЗОВ:**
Опиши ситуацию до:
- Бизнес-проблемы, с которыми они столкнулись
- Влияние на операции/выручку
- Предыдущие опробованные решения
- Почему те решения не сработали
- Что на кону, если проблему не решить
- Цитата клиента, описывающая боль

**РЕШЕНИЕ:**
История внедрения:
- Как они узнали о твоём продукте/услуге
- Критерии выбора и почему выбрали вас
- Процесс внедрения и таймлайн
- Ключевые использованные функции/услуги
- Интеграция с существующими системами
- Подход к обучению и принятию

**РЕЗУЛЬТАТЫ:**
Для каждой метрики предоставь:
- Число до
- Число после
- Процент улучшения
- Время достижения
- Бизнес-влияние в деньгах (когда возможно)

Категории:
- Первичные KPI (напрямую связанные с целями)
- Вторичные выгоды (неожиданные победы)
- Качественные улучшения

**РЕКОМЕНДАЦИИ ПО ВИЗУАЛИЗАЦИИ ДАННЫХ:**
- Типы графиков для каждой метрики
- Визуализации сравнения
- Графики таймлайна
- Дизайн выносок цитат

**ЭЛЕМЕНТЫ СОЦИАЛЬНОГО ДОКАЗАТЕЛЬСТВА:**
- 3-5 цитат с контекстом
- Скрипт видео-отзыва (если применимо)
- Соображения по разрешениям и согласованию

**ИЗВЛЕЧЁННЫЕ УРОКИ:**
- Что сделало это внедрение успешным
- Совет для похожих компаний
- Что бы они сделали иначе

**ПРИЗЫВ К ДЕЙСТВИЮ:**
- Конкретный следующий шаг для читателей
- Связанные ресурсы для предложения
- Размещение контактной информации

**ВАРИАЦИИ ФОРМАТА:**
Предоставь вариации для:
- Полный PDF (2-3 страницы)
- Одностраничное резюме
- Лендинг на сайте
- Сниппеты для соцсетей (3-5)
- Слайды для sales-презентации (3-5)

**ВОПРОСЫ ДЛЯ ИНТЕРВЬЮ:**
Предоставь 15-20 вопросов для клиента для сбора этой информации

Создай кейс-стади для:`,
    defaultInputUa: `Дій як B2B Content Writer, що спеціалізується на кейс-стаді, які закривають enterprise угоди. Створи комплексний кейс-стаді:

**РЕЗЮМЕ ДЛЯ КЕРІВНИЦТВА (100 слів):**
- Клієнт та індустрія
- Виклик в одному реченні
- Рішення в одному реченні
- Ключові результати (2-3 метрики)
- Часові рамки

**ПРОФІЛЬ КЛІЄНТА:**
- Огляд компанії
- Контекст індустрії
- Розмір та масштаб (співробітники, виручка, локації)
- Релевантний бекграунд для впізнаваності
- Ключові особи, що приймають рішення (посади)

**ВИКЛИК:**
Опиши ситуацію до:
- Бізнес-проблеми, з якими вони зіткнулися
- Вплив на операції/виручку
- Попередні випробувані рішення
- Чому ті рішення не спрацювали
- Що на кону, якщо проблему не вирішити
- Цитата клієнта, що описує біль

**РІШЕННЯ:**
Історія впровадження:
- Як вони дізналися про твій продукт/послугу
- Критерії вибору та чому обрали вас
- Процес впровадження та таймлайн
- Ключові використані функції/послуги
- Інтеграція з існуючими системами
- Підхід до навчання та прийняття

**РЕЗУЛЬТАТИ:**
Для кожної метрики надай:
- Число до
- Число після
- Відсоток покращення
- Час досягнення
- Бізнес-вплив в грошах (коли можливо)

Категорії:
- Первинні KPI (напряму повʼязані з цілями)
- Вторинні вигоди (неочікувані перемоги)
- Якісні покращення

**РЕКОМЕНДАЦІЇ ЩОДО ВІЗУАЛІЗАЦІЇ ДАНИХ:**
- Типи графіків для кожної метрики
- Візуалізації порівняння
- Графіки таймлайну
- Дизайн виносок цитат

**ЕЛЕМЕНТИ СОЦІАЛЬНОГО ДОКАЗУ:**
- 3-5 цитат з контекстом
- Скрипт відео-відгуку (якщо застосовно)
- Міркування щодо дозволів та погодження

**ОТРИМАНІ УРОКИ:**
- Що зробило це впровадження успішним
- Порада для схожих компаній
- Що б вони зробили інакше

**ЗАКЛИК ДО ДІЇ:**
- Конкретний наступний крок для читачів
- Повʼязані ресурси для пропозиції
- Розміщення контактної інформації

**ВАРІАЦІЇ ФОРМАТУ:**
Надай варіації для:
- Повний PDF (2-3 сторінки)
- Односторінкове резюме
- Лендинг на сайті
- Сніпети для соцмереж (3-5)
- Слайди для sales-презентації (3-5)

**ПИТАННЯ ДЛЯ ІНТЕРВʼЮ:**
Надай 15-20 питань для клієнта для збору цієї інформації

Створи кейс-стаді для:`,
    category: "copywriting",
  },

  // ==================== ANALYTICS ====================
  {
    id: "data-analysis",
    title: "Data Analysis Framework",
    titleRu: "Фреймворк анализа данных",
    titleUa: "Фреймворк аналізу даних",
    description: "Systematic data analysis with hypothesis testing, statistical significance calculations, and executive-ready recommendations",
    descriptionRu: "Систематический анализ данных с проверкой гипотез, расчётами статистической значимости и рекомендациями для руководства",
    descriptionUa: "Систематичний аналіз даних з перевіркою гіпотез, розрахунками статистичної значущості та рекомендаціями для керівництва",
    icon: BarChart3,
    example: "Analyze e-commerce conversion funnel data to identify drop-off points and optimization opportunities",
    exampleRu: "Проанализировать воронку конверсии e-commerce для выявления точек отсева и возможностей оптимизации",
    exampleUa: "Проаналізувати воронку конверсії e-commerce для виявлення точок відсіву та можливостей оптимізації",
    defaultInput: `Act as a Senior Data Analyst with experience at top consulting firms. Perform comprehensive data analysis:

**DATA UNDERSTANDING:**
- Describe the dataset structure
- Identify key variables and their types
- Note data quality issues (missing values, outliers, inconsistencies)
- Define the analysis objective and key questions

**EXPLORATORY ANALYSIS:**
- Summary statistics for key metrics
- Distribution analysis
- Correlation exploration
- Time series patterns (if applicable)
- Segment comparisons

**HYPOTHESIS FRAMEWORK:**
For each hypothesis:
- H0 (null hypothesis)
- H1 (alternative hypothesis)
- Appropriate statistical test
- Required assumptions
- Sample size considerations

**STATISTICAL ANALYSIS:**
- Test selection rationale
- Confidence interval calculations
- P-value interpretation
- Effect size estimation
- Power analysis if relevant

**VISUALIZATION RECOMMENDATIONS:**
For each insight:
- Recommended chart type
- Key elements to highlight
- Color coding suggestions
- Annotation recommendations

**KEY FINDINGS:**
Rank findings by business impact:
1. [Finding] - Confidence level - Business impact estimate
2. [Finding] - Confidence level - Business impact estimate
(Continue for all significant findings)

**ROOT CAUSE ANALYSIS:**
- Identify underlying drivers
- Distinguish correlation from causation
- External factors to consider
- Data limitations that affect conclusions

**ACTIONABLE RECOMMENDATIONS:**
For each recommendation:
- Specific action to take
- Expected impact (quantified)
- Implementation complexity (Low/Medium/High)
- Measurement approach
- Timeline

**NEXT STEPS:**
- Additional data to collect
- Follow-up analyses
- A/B tests to run
- Monitoring dashboards to create

**EXECUTIVE SUMMARY:**
- One paragraph for C-suite
- 3 key takeaways
- Recommended decisions
- Risk factors

Analyze:`,
    defaultInputRu: `Действуй как Senior Data Analyst с опытом в топовых консалтинговых компаниях. Проведи комплексный анализ данных:

**ПОНИМАНИЕ ДАННЫХ:**
- Опиши структуру датасета
- Определи ключевые переменные и их типы
- Отметь проблемы качества данных (пропуски, выбросы, несоответствия)
- Определи цель анализа и ключевые вопросы

**ИССЛЕДОВАТЕЛЬСКИЙ АНАЛИЗ:**
- Описательная статистика по ключевым метрикам
- Анализ распределений
- Исследование корреляций
- Паттерны временных рядов (если применимо)
- Сравнения сегментов

**ФРЕЙМВОРК ГИПОТЕЗ:**
Для каждой гипотезы:
- H0 (нулевая гипотеза)
- H1 (альтернативная гипотеза)
- Подходящий статистический тест
- Необходимые предположения
- Соображения по размеру выборки

**СТАТИСТИЧЕСКИЙ АНАЛИЗ:**
- Обоснование выбора теста
- Расчёты доверительных интервалов
- Интерпретация p-value
- Оценка размера эффекта
- Power analysis если релевантно

**РЕКОМЕНДАЦИИ ПО ВИЗУАЛИЗАЦИИ:**
Для каждого инсайта:
- Рекомендуемый тип графика
- Ключевые элементы для выделения
- Предложения по цветовому кодированию
- Рекомендации по аннотациям

**КЛЮЧЕВЫЕ НАХОДКИ:**
Ранжируй находки по бизнес-влиянию:
1. [Находка] - Уровень уверенности - Оценка бизнес-влияния
2. [Находка] - Уровень уверенности - Оценка бизнес-влияния
(Продолжи для всех значимых находок)

**АНАЛИЗ ПЕРВОПРИЧИН:**
- Определи базовые драйверы
- Разграничь корреляцию и причинность
- Внешние факторы для учёта
- Ограничения данных, влияющие на выводы

**ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ:**
Для каждой рекомендации:
- Конкретное действие
- Ожидаемый эффект (количественно)
- Сложность внедрения (Низкая/Средняя/Высокая)
- Подход к измерению
- Таймлайн

**СЛЕДУЮЩИЕ ШАГИ:**
- Дополнительные данные для сбора
- Последующие анализы
- A/B тесты для проведения
- Дашборды мониторинга для создания

**РЕЗЮМЕ ДЛЯ РУКОВОДСТВА:**
- Один параграф для C-level
- 3 ключевых вывода
- Рекомендуемые решения
- Факторы риска

Проанализируй:`,
    defaultInputUa: `Дій як Senior Data Analyst з досвідом у топових консалтингових компаніях. Проведи комплексний аналіз даних:

**РОЗУМІННЯ ДАНИХ:**
- Опиши структуру датасету
- Визнач ключові змінні та їх типи
- Відміть проблеми якості даних (пропуски, викиди, невідповідності)
- Визнач ціль аналізу та ключові питання

**ДОСЛІДНИЦЬКИЙ АНАЛІЗ:**
- Описова статистика по ключових метриках
- Аналіз розподілів
- Дослідження кореляцій
- Патерни часових рядів (якщо застосовно)
- Порівняння сегментів

**ФРЕЙМВОРК ГІПОТЕЗ:**
Для кожної гіпотези:
- H0 (нульова гіпотеза)
- H1 (альтернативна гіпотеза)
- Підходящий статистичний тест
- Необхідні припущення
- Міркування щодо розміру вибірки

**СТАТИСТИЧНИЙ АНАЛІЗ:**
- Обґрунтування вибору тесту
- Розрахунки довірчих інтервалів
- Інтерпретація p-value
- Оцінка розміру ефекту
- Power analysis якщо релевантно

**РЕКОМЕНДАЦІЇ ЩОДО ВІЗУАЛІЗАЦІЇ:**
Для кожного інсайту:
- Рекомендований тип графіка
- Ключові елементи для виділення
- Пропозиції щодо колірного кодування
- Рекомендації щодо анотацій

**КЛЮЧОВІ ЗНАХІДКИ:**
Ранжуй знахідки за бізнес-впливом:
1. [Знахідка] - Рівень впевненості - Оцінка бізнес-впливу
2. [Знахідка] - Рівень впевненості - Оцінка бізнес-впливу
(Продовж для всіх значущих знахідок)

**АНАЛІЗ ПЕРШОПРИЧИН:**
- Визнач базові драйвери
- Розмежуй кореляцію та причинність
- Зовнішні фактори для врахування
- Обмеження даних, що впливають на висновки

**ПРАКТИЧНІ РЕКОМЕНДАЦІЇ:**
Для кожної рекомендації:
- Конкретна дія
- Очікуваний ефект (кількісно)
- Складність впровадження (Низька/Середня/Висока)
- Підхід до вимірювання
- Таймлайн

**НАСТУПНІ КРОКИ:**
- Додаткові дані для збору
- Подальші аналізи
- A/B тести для проведення
- Дашборди моніторингу для створення

**РЕЗЮМЕ ДЛЯ КЕРІВНИЦТВА:**
- Один параграф для C-level
- 3 ключових висновки
- Рекомендовані рішення
- Фактори ризику

Проаналізуй:`,
    category: "analytics",
  },
  {
    id: "competitor-research",
    title: "Competitive Intelligence Report",
    titleRu: "Отчёт конкурентной разведки",
    titleUa: "Звіт конкурентної розвідки",
    description: "Deep-dive competitor analysis with pricing intelligence, feature matrices, positioning maps, and strategic recommendations",
    descriptionRu: "Глубокий анализ конкурентов с разведкой цен, матрицами функций, картами позиционирования и стратегическими рекомендациями",
    descriptionUa: "Глибокий аналіз конкурентів з розвідкою цін, матрицями функцій, картами позиціонування та стратегічними рекомендаціями",
    icon: Search,
    example: "Competitive analysis for a new project management tool entering the SMB market",
    exampleRu: "Конкурентный анализ для нового инструмента управления проектами на SMB рынке",
    exampleUa: "Конкурентний аналіз для нового інструменту управління проектами на SMB ринку",
    defaultInput: `Act as a Competitive Intelligence Analyst at a Fortune 500 company. Create a comprehensive competitive analysis:

**MARKET LANDSCAPE:**
- Market size and growth trajectory
- Key market segments
- Industry trends and disruptions
- Regulatory considerations
- Market maturity assessment

**COMPETITOR IDENTIFICATION:**
Categorize competitors:
- Direct competitors (same solution, same market)
- Indirect competitors (different solution, same problem)
- Potential future competitors (adjacent markets)
- Substitute products/services

**COMPETITOR PROFILES:**
For each major competitor (5-7), analyze:

**Company Overview:**
- Founded, headquarters, ownership
- Funding history and investors
- Revenue estimates
- Employee count and growth
- Key executives and their backgrounds

**Product Analysis:**
- Core product/service offerings
- Feature inventory (comprehensive list)
- Technology stack (if known)
- Integration ecosystem
- Product roadmap signals

**Go-to-Market:**
- Target customer segments
- Pricing model and tiers
- Sales motion (self-serve, sales-led, hybrid)
- Key partnerships and channels
- Marketing strategies and channels

**Positioning:**
- Tagline and key messaging
- Claimed differentiators
- Customer testimonials themes
- Case studies and social proof

**FEATURE COMPARISON MATRIX:**
| Feature | Your Product | Competitor A | Competitor B | Competitor C |
|---------|--------------|--------------|--------------|--------------|
| [Feature 1] | ✓/○/× | ✓/○/× | ✓/○/× | ✓/○/× |
(✓ = strong, ○ = partial, × = missing)

**PRICING INTELLIGENCE:**
| Competitor | Entry Price | Mid-Tier | Enterprise | Pricing Model |
|------------|-------------|----------|------------|---------------|

**POSITIONING MAP:**
- Create 2x2 positioning framework
- Identify white space opportunities
- Explain axis selection rationale

**SWOT ANALYSIS:**
For your company vs competitive set:
- Strengths (defensible advantages)
- Weaknesses (gaps to address)
- Opportunities (market openings)
- Threats (competitive risks)

**STRATEGIC RECOMMENDATIONS:**
- Differentiation opportunities
- Features to prioritize
- Messaging adjustments
- Pricing considerations
- Partnership opportunities
- M&A considerations

**MONITORING PLAN:**
- Key signals to track
- Competitor alert setup
- Review cadence

Create competitive analysis for:`,
    defaultInputRu: `Действуй как Competitive Intelligence Analyst в Fortune 500 компании. Создай комплексный конкурентный анализ:

**ЛАНДШАФТ РЫНКА:**
- Размер рынка и траектория роста
- Ключевые сегменты рынка
- Индустриальные тренды и дизрупции
- Регуляторные соображения
- Оценка зрелости рынка

**ИДЕНТИФИКАЦИЯ КОНКУРЕНТОВ:**
Категоризируй конкурентов:
- Прямые конкуренты (то же решение, тот же рынок)
- Косвенные конкуренты (другое решение, та же проблема)
- Потенциальные будущие конкуренты (смежные рынки)
- Продукты/услуги-заменители

**ПРОФИЛИ КОНКУРЕНТОВ:**
Для каждого основного конкурента (5-7), проанализируй:

**Обзор компании:**
- Основана, штаб-квартира, собственность
- История финансирования и инвесторы
- Оценки выручки
- Количество сотрудников и рост
- Ключевые руководители и их бэкграунд

**Анализ продукта:**
- Основные продукты/услуги
- Инвентарь функций (комплексный список)
- Технологический стек (если известен)
- Экосистема интеграций
- Сигналы продуктового роадмапа

**Go-to-Market:**
- Целевые клиентские сегменты
- Модель ценообразования и тарифы
- Sales motion (self-serve, sales-led, гибридный)
- Ключевые партнёрства и каналы
- Маркетинговые стратегии и каналы

**Позиционирование:**
- Слоган и ключевые сообщения
- Заявленные дифференциаторы
- Темы отзывов клиентов
- Кейс-стади и социальные доказательства

**МАТРИЦА СРАВНЕНИЯ ФУНКЦИЙ:**
| Функция | Твой продукт | Конкурент A | Конкурент B | Конкурент C |
|---------|--------------|-------------|-------------|-------------|
| [Функция 1] | ✓/○/× | ✓/○/× | ✓/○/× | ✓/○/× |
(✓ = сильно, ○ = частично, × = отсутствует)

**РАЗВЕДКА ЦЕНООБРАЗОВАНИЯ:**
| Конкурент | Входная цена | Средний тариф | Enterprise | Модель |
|-----------|--------------|---------------|------------|--------|

**КАРТА ПОЗИЦИОНИРОВАНИЯ:**
- Создай 2x2 фреймворк позиционирования
- Выяви возможности белого пространства
- Объясни обоснование выбора осей

**SWOT АНАЛИЗ:**
Для твоей компании vs конкурентного набора:
- Сильные стороны (защищаемые преимущества)
- Слабые стороны (пробелы для устранения)
- Возможности (рыночные отверстия)
- Угрозы (конкурентные риски)

**СТРАТЕГИЧЕСКИЕ РЕКОМЕНДАЦИИ:**
- Возможности дифференциации
- Функции для приоритизации
- Корректировки сообщений
- Соображения по ценообразованию
- Возможности партнёрства
- M&A соображения

**ПЛАН МОНИТОРИНГА:**
- Ключевые сигналы для отслеживания
- Настройка алертов по конкурентам
- Каденция ревью

Создай конкурентный анализ для:`,
    defaultInputUa: `Дій як Competitive Intelligence Analyst у Fortune 500 компанії. Створи комплексний конкурентний аналіз:

**ЛАНДШАФТ РИНКУ:**
- Розмір ринку та траєкторія зростання
- Ключові сегменти ринку
- Індустріальні тренди та дизрупції
- Регуляторні міркування
- Оцінка зрілості ринку

**ІДЕНТИФІКАЦІЯ КОНКУРЕНТІВ:**
Категоризуй конкурентів:
- Прямі конкуренти (те саме рішення, той самий ринок)
- Непрямі конкуренти (інше рішення, та сама проблема)
- Потенційні майбутні конкуренти (суміжні ринки)
- Продукти/послуги-замінники

**ПРОФІЛІ КОНКУРЕНТІВ:**
Для кожного основного конкурента (5-7), проаналізуй:

**Огляд компанії:**
- Заснована, штаб-квартира, власність
- Історія фінансування та інвестори
- Оцінки виручки
- Кількість співробітників та зростання
- Ключові керівники та їх бекграунд

**Аналіз продукту:**
- Основні продукти/послуги
- Інвентар функцій (комплексний список)
- Технологічний стек (якщо відомий)
- Екосистема інтеграцій
- Сигнали продуктового роадмапу

**Go-to-Market:**
- Цільові клієнтські сегменти
- Модель ціноутворення та тарифи
- Sales motion (self-serve, sales-led, гібридний)
- Ключові партнерства та канали
- Маркетингові стратегії та канали

**Позиціонування:**
- Слоган та ключові повідомлення
- Заявлені диференціатори
- Теми відгуків клієнтів
- Кейс-стаді та соціальні докази

**МАТРИЦЯ ПОРІВНЯННЯ ФУНКЦІЙ:**
| Функція | Твій продукт | Конкурент A | Конкурент B | Конкурент C |
|---------|--------------|-------------|-------------|-------------|
| [Функція 1] | ✓/○/× | ✓/○/× | ✓/○/× | ✓/○/× |
(✓ = сильно, ○ = частково, × = відсутня)

**РОЗВІДКА ЦІНОУТВОРЕННЯ:**
| Конкурент | Вхідна ціна | Середній тариф | Enterprise | Модель |
|-----------|-------------|----------------|------------|--------|

**КАРТА ПОЗИЦІОНУВАННЯ:**
- Створи 2x2 фреймворк позиціонування
- Виявити можливості білого простору
- Поясни обґрунтування вибору осей

**SWOT АНАЛІЗ:**
Для твоєї компанії vs конкурентного набору:
- Сильні сторони (захищувані переваги)
- Слабкі сторони (прогалини для усунення)
- Можливості (ринкові отвори)
- Загрози (конкурентні ризики)

**СТРАТЕГІЧНІ РЕКОМЕНДАЦІЇ:**
- Можливості диференціації
- Функції для пріоритизації
- Коригування повідомлень
- Міркування щодо ціноутворення
- Можливості партнерства
- M&A міркування

**ПЛАН МОНІТОРИНГУ:**
- Ключові сигнали для відстеження
- Налаштування алертів по конкурентах
- Каденція ревʼю

Створи конкурентний аналіз для:`,
    category: "analytics",
  },

  // ==================== BUSINESS ====================
  {
    id: "business-plan",
    title: "Investor-Ready Business Plan",
    titleRu: "Бизнес-план для инвесторов",
    titleUa: "Бізнес-план для інвесторів",
    description: "Complete business plan with financial projections, unit economics, market analysis, and fundraising strategy",
    descriptionRu: "Полный бизнес-план с финансовыми прогнозами, юнит-экономикой, анализом рынка и стратегией привлечения инвестиций",
    descriptionUa: "Повний бізнес-план з фінансовими прогнозами, юніт-економікою, аналізом ринку та стратегією залучення інвестицій",
    icon: Briefcase,
    example: "Climate tech startup developing carbon capture technology for industrial facilities",
    exampleRu: "Климатический стартап, разрабатывающий технологию захвата углерода для промышленных объектов",
    exampleUa: "Кліматичний стартап, що розробляє технологію захоплення вуглецю для промислових обʼєктів",
    defaultInput: `Act as a Startup Advisor who has helped raise $500M+ in venture funding. Create an investor-ready business plan:

**EXECUTIVE SUMMARY:**
- Company one-liner
- Problem statement (2-3 sentences)
- Solution overview
- Target market and size
- Business model
- Traction highlights
- Team summary
- Funding ask and use of funds

**PROBLEM & OPPORTUNITY:**
- Market pain point (with data)
- Current solutions and their limitations
- Why now? (Market timing thesis)
- Consequences of not solving
- Size of the problem (TAM, SAM, SOM)

**SOLUTION:**
- Product/service description
- Key features and benefits
- Unique value proposition
- Technology/IP advantages
- Product roadmap (12-24 months)
- Moat and defensibility

**MARKET ANALYSIS:**
- Industry overview and trends
- Total Addressable Market sizing methodology
- Target customer segments
- Customer personas
- Buyer journey and decision process

**BUSINESS MODEL:**
- Revenue streams
- Pricing strategy
- Unit economics:
  - Customer Acquisition Cost (CAC)
  - Lifetime Value (LTV)
  - LTV:CAC ratio
  - Payback period
  - Gross margin
- Sales cycle and process

**GO-TO-MARKET STRATEGY:**
- Launch strategy
- Customer acquisition channels
- Sales strategy (direct, partners, self-serve)
- Marketing strategy
- Growth loops and virality

**COMPETITIVE ANALYSIS:**
- Competitive landscape map
- Direct vs indirect competitors
- Differentiation strategy
- Competitive advantages

**TEAM:**
- Founder backgrounds and relevant experience
- Key hires made and planned
- Advisory board
- Why this team wins

**TRACTION:**
- Key metrics and milestones achieved
- Customer testimonials
- Partnerships secured
- Awards and recognition

**FINANCIAL PROJECTIONS (5 years):**
- Revenue projections with assumptions
- Cost structure
- Path to profitability
- Key financial metrics by year
- Scenario analysis (base, upside, downside)

**FUNDING REQUEST:**
- Amount raising
- Valuation expectations
- Use of funds breakdown
- Milestones this funding enables
- Future funding expectations

**RISK ANALYSIS:**
- Key risks and mitigations
- Regulatory considerations
- Market risks
- Execution risks

**APPENDIX:**
- Detailed financial model
- Market research sources
- Customer letters of intent
- Technical specifications

Create business plan for:`,
    defaultInputRu: `Действуй как Startup Advisor, помогший привлечь $500M+ венчурного финансирования. Создай бизнес-план для инвесторов:

**РЕЗЮМЕ:**
- Компания в одном предложении
- Постановка проблемы (2-3 предложения)
- Обзор решения
- Целевой рынок и размер
- Бизнес-модель
- Основные достижения
- Краткое описание команды
- Запрос финансирования и использование средств

**ПРОБЛЕМА И ВОЗМОЖНОСТЬ:**
- Рыночная боль (с данными)
- Текущие решения и их ограничения
- Почему сейчас? (Тезис о тайминге рынка)
- Последствия нерешения
- Размер проблемы (TAM, SAM, SOM)

**РЕШЕНИЕ:**
- Описание продукта/услуги
- Ключевые функции и преимущества
- Уникальное ценностное предложение
- Технологические/IP преимущества
- Продуктовый роадмап (12-24 месяца)
- Moat и защищаемость

**АНАЛИЗ РЫНКА:**
- Обзор индустрии и тренды
- Методология расчёта TAM
- Целевые клиентские сегменты
- Персоны клиентов
- Путь покупателя и процесс принятия решений

**БИЗНЕС-МОДЕЛЬ:**
- Источники дохода
- Стратегия ценообразования
- Юнит-экономика:
  - Customer Acquisition Cost (CAC)
  - Lifetime Value (LTV)
  - Соотношение LTV:CAC
  - Период окупаемости
  - Валовая маржа
- Цикл и процесс продаж

**GO-TO-MARKET СТРАТЕГИЯ:**
- Стратегия запуска
- Каналы привлечения клиентов
- Стратегия продаж (прямые, партнёры, self-serve)
- Маркетинговая стратегия
- Петли роста и виральность

**КОНКУРЕНТНЫЙ АНАЛИЗ:**
- Карта конкурентного ландшафта
- Прямые vs косвенные конкуренты
- Стратегия дифференциации
- Конкурентные преимущества

**КОМАНДА:**
- Бэкграунд основателей и релевантный опыт
- Ключевые сделанные и планируемые наймы
- Консультативный совет
- Почему эта команда победит

**ТРАКШЕН:**
- Ключевые метрики и достигнутые вехи
- Отзывы клиентов
- Заключённые партнёрства
- Награды и признание

**ФИНАНСОВЫЕ ПРОГНОЗЫ (5 лет):**
- Прогнозы выручки с предположениями
- Структура затрат
- Путь к прибыльности
- Ключевые финансовые метрики по годам
- Сценарный анализ (базовый, оптимистичный, пессимистичный)

**ЗАПРОС ФИНАНСИРОВАНИЯ:**
- Сумма привлечения
- Ожидания по оценке
- Разбивка использования средств
- Вехи, которые это финансирование позволит достичь
- Ожидания будущего финансирования

**АНАЛИЗ РИСКОВ:**
- Ключевые риски и митигации
- Регуляторные соображения
- Рыночные риски
- Риски исполнения

**ПРИЛОЖЕНИЕ:**
- Детальная финансовая модель
- Источники рыночных исследований
- Письма о намерениях клиентов
- Технические спецификации

Создай бизнес-план для:`,
    defaultInputUa: `Дій як Startup Advisor, що допоміг залучити $500M+ венчурного фінансування. Створи бізнес-план для інвесторів:

**РЕЗЮМЕ:**
- Компанія в одному реченні
- Постановка проблеми (2-3 речення)
- Огляд рішення
- Цільовий ринок та розмір
- Бізнес-модель
- Основні досягнення
- Короткий опис команди
- Запит фінансування та використання коштів

**ПРОБЛЕМА ТА МОЖЛИВІСТЬ:**
- Ринковий біль (з даними)
- Поточні рішення та їх обмеження
- Чому зараз? (Теза про таймінг ринку)
- Наслідки невирішення
- Розмір проблеми (TAM, SAM, SOM)

**РІШЕННЯ:**
- Опис продукту/послуги
- Ключові функції та переваги
- Унікальна ціннісна пропозиція
- Технологічні/IP переваги
- Продуктовий роадмап (12-24 місяці)
- Moat та захищуваність

**АНАЛІЗ РИНКУ:**
- Огляд індустрії та тренди
- Методологія розрахунку TAM
- Цільові клієнтські сегменти
- Персони клієнтів
- Шлях покупця та процес прийняття рішень

**БІЗНЕС-МОДЕЛЬ:**
- Джерела доходу
- Стратегія ціноутворення
- Юніт-економіка:
  - Customer Acquisition Cost (CAC)
  - Lifetime Value (LTV)
  - Співвідношення LTV:CAC
  - Період окупності
  - Валова маржа
- Цикл та процес продажів

**GO-TO-MARKET СТРАТЕГІЯ:**
- Стратегія запуску
- Канали залучення клієнтів
- Стратегія продажів (прямі, партнери, self-serve)
- Маркетингова стратегія
- Петлі зростання та віральність

**КОНКУРЕНТНИЙ АНАЛІЗ:**
- Карта конкурентного ландшафту
- Прямі vs непрямі конкуренти
- Стратегія диференціації
- Конкурентні переваги

**КОМАНДА:**
- Бекграунд засновників та релевантний досвід
- Ключові зроблені та заплановані найми
- Консультативна рада
- Чому ця команда переможе

**ТРАКШЕН:**
- Ключові метрики та досягнуті віхи
- Відгуки клієнтів
- Укладені партнерства
- Нагороди та визнання

**ФІНАНСОВІ ПРОГНОЗИ (5 років):**
- Прогнози виручки з припущеннями
- Структура витрат
- Шлях до прибутковості
- Ключові фінансові метрики за роками
- Сценарний аналіз (базовий, оптимістичний, песимістичний)

**ЗАПИТ ФІНАНСУВАННЯ:**
- Сума залучення
- Очікування щодо оцінки
- Розбивка використання коштів
- Віхи, які це фінансування дозволить досягти
- Очікування майбутнього фінансування

**АНАЛІЗ РИЗИКІВ:**
- Ключові ризики та мітигації
- Регуляторні міркування
- Ринкові ризики
- Ризики виконання

**ДОДАТОК:**
- Детальна фінансова модель
- Джерела ринкових досліджень
- Листи про наміри клієнтів
- Технічні специфікації

Створи бізнес-план для:`,
    category: "business",
  },
  {
    id: "okr-framework",
    title: "OKR Planning Framework",
    titleRu: "Фреймворк планирования OKR",
    titleUa: "Фреймворк планування OKR",
    description: "Complete OKR cascade with company objectives, team key results, individual goals, and tracking systems",
    descriptionRu: "Полный каскад OKR с целями компании, ключевыми результатами команд, индивидуальными целями и системами отслеживания",
    descriptionUa: "Повний каскад OKR з цілями компанії, ключовими результатами команд, індивідуальними цілями та системами відстеження",
    icon: Target,
    example: "Series A SaaS startup planning Q1 OKRs focused on product-market fit and growth",
    exampleRu: "SaaS стартап Series A, планирующий OKR на Q1 с фокусом на product-market fit и рост",
    exampleUa: "SaaS стартап Series A, що планує OKR на Q1 з фокусом на product-market fit та зростання",
    defaultInput: `Act as a Chief of Staff who has implemented OKR systems at hyper-growth startups. Design a comprehensive OKR framework:

**OKR PHILOSOPHY:**
- Goal-setting approach for this stage
- Stretch target philosophy (70% achievable)
- Alignment vs autonomy balance
- Cadence recommendations

**COMPANY-LEVEL OBJECTIVES (3-5):**
For each objective:
- Objective statement (inspirational, qualitative)
- Strategic rationale
- Key Results (3-5 per objective):
  - Specific, measurable metric
  - Current baseline
  - Target value
  - Confidence level (1-10)
  - Owner (role/team)
- Leading indicators to track weekly
- Risk factors and mitigations

**TEAM OKR CASCADE:**
For each major team (Product, Engineering, Sales, Marketing, Customer Success):

**[Team Name] Objectives:**
- How team objective aligns to company objective
- Team-specific key results
- Dependencies on other teams
- Resource requirements

**INDIVIDUAL OKR EXAMPLES:**
- Sample individual objectives for key roles
- How individual KRs ladder up to team KRs
- Personal development component

**OKR SCORING SYSTEM:**
- Scoring methodology (0-1 scale)
- Score interpretation guidelines
- How to handle missed OKRs
- Celebration protocols for achievements

**TRACKING & RITUALS:**
Weekly:
- Check-in format and questions
- Confidence level updates
- Blocker identification

Monthly:
- Progress review format
- Course correction process
- Resource reallocation triggers

Quarterly:
- Retrospective format
- Scoring ceremony
- Planning process for next quarter

**TOOLS & TEMPLATES:**
- OKR documentation template
- Weekly check-in template
- Quarterly review presentation template
- Dashboard design recommendations

**COMMON PITFALLS:**
- Mistakes to avoid
- Signs of OKR dysfunction
- How to get back on track

**CHANGE MANAGEMENT:**
- How to introduce OKRs to the team
- Training agenda
- First quarter expectations

Create OKR framework for:`,
    defaultInputRu: `Действуй как Chief of Staff, внедривший системы OKR в гипер-растущих стартапах. Спроектируй комплексный фреймворк OKR:

**ФИЛОСОФИЯ OKR:**
- Подход к целеполаганию для этой стадии
- Философия stretch-целей (70% достижимо)
- Баланс выравнивания vs автономии
- Рекомендации по каденции

**ЦЕЛИ УРОВНЯ КОМПАНИИ (3-5):**
Для каждой цели:
- Формулировка цели (вдохновляющая, качественная)
- Стратегическое обоснование
- Ключевые результаты (3-5 на цель):
  - Конкретная, измеримая метрика
  - Текущий базовый уровень
  - Целевое значение
  - Уровень уверенности (1-10)
  - Владелец (роль/команда)
- Опережающие индикаторы для еженедельного отслеживания
- Факторы риска и митигации

**КАСКАД OKR КОМАНД:**
Для каждой основной команды (Продукт, Инжиниринг, Продажи, Маркетинг, Customer Success):

**Цели [Название команды]:**
- Как цель команды связана с целью компании
- Командные ключевые результаты
- Зависимости от других команд
- Требования к ресурсам

**ПРИМЕРЫ ИНДИВИДУАЛЬНЫХ OKR:**
- Примеры индивидуальных целей для ключевых ролей
- Как индивидуальные KR поднимаются к командным KR
- Компонент личного развития

**СИСТЕМА СКОРИНГА OKR:**
- Методология скоринга (шкала 0-1)
- Гайдлайны по интерпретации оценок
- Как обрабатывать пропущенные OKR
- Протоколы празднования достижений

**ОТСЛЕЖИВАНИЕ И РИТУАЛЫ:**
Еженедельно:
- Формат и вопросы чек-ина
- Обновления уровня уверенности
- Идентификация блокеров

Ежемесячно:
- Формат ревью прогресса
- Процесс корректировки курса
- Триггеры перераспределения ресурсов

Ежеквартально:
- Формат ретроспективы
- Церемония скоринга
- Процесс планирования следующего квартала

**ИНСТРУМЕНТЫ И ШАБЛОНЫ:**
- Шаблон документации OKR
- Шаблон еженедельного чек-ина
- Шаблон презентации квартального ревью
- Рекомендации по дизайну дашборда

**ТИПИЧНЫЕ ОШИБКИ:**
- Ошибки, которых следует избегать
- Признаки дисфункции OKR
- Как вернуться на путь

**УПРАВЛЕНИЕ ИЗМЕНЕНИЯМИ:**
- Как представить OKR команде
- Повестка тренинга
- Ожидания первого квартала

Создай фреймворк OKR для:`,
    defaultInputUa: `Дій як Chief of Staff, що впровадив системи OKR у гіпер-зростаючих стартапах. Спроектуй комплексний фреймворк OKR:

**ФІЛОСОФІЯ OKR:**
- Підхід до цілепокладання для цієї стадії
- Філософія stretch-цілей (70% досяжно)
- Баланс вирівнювання vs автономії
- Рекомендації щодо каденції

**ЦІЛІ РІВНЯ КОМПАНІЇ (3-5):**
Для кожної цілі:
- Формулювання цілі (надихаюче, якісне)
- Стратегічне обґрунтування
- Ключові результати (3-5 на ціль):
  - Конкретна, вимірювана метрика
  - Поточний базовий рівень
  - Цільове значення
  - Рівень впевненості (1-10)
  - Власник (роль/команда)
- Випереджаючі індикатори для щотижневого відстеження
- Фактори ризику та мітигації

**КАСКАД OKR КОМАНД:**
Для кожної основної команди (Продукт, Інжиніринг, Продажі, Маркетинг, Customer Success):

**Цілі [Назва команди]:**
- Як ціль команди повʼязана з ціллю компанії
- Командні ключові результати
- Залежності від інших команд
- Вимоги до ресурсів

**ПРИКЛАДИ ІНДИВІДУАЛЬНИХ OKR:**
- Приклади індивідуальних цілей для ключових ролей
- Як індивідуальні KR піднімаються до командних KR
- Компонент особистого розвитку

**СИСТЕМА СКОРИНГУ OKR:**
- Методологія скорингу (шкала 0-1)
- Гайдлайни з інтерпретації оцінок
- Як обробляти пропущені OKR
- Протоколи святкування досягнень

**ВІДСТЕЖЕННЯ ТА РИТУАЛИ:**
Щотижня:
- Формат та питання чек-іну
- Оновлення рівня впевненості
- Ідентифікація блокерів

Щомісяця:
- Формат ревʼю прогресу
- Процес коригування курсу
- Тригери перерозподілу ресурсів

Щокварталу:
- Формат ретроспективи
- Церемонія скорингу
- Процес планування наступного кварталу

**ІНСТРУМЕНТИ ТА ШАБЛОНИ:**
- Шаблон документації OKR
- Шаблон щотижневого чек-іну
- Шаблон презентації квартального ревʼю
- Рекомендації щодо дизайну дашборду

**ТИПОВІ ПОМИЛКИ:**
- Помилки, яких слід уникати
- Ознаки дисфункції OKR
- Як повернутися на шлях

**УПРАВЛІННЯ ЗМІНАМИ:**
- Як представити OKR команді
- Порядок денний тренінгу
- Очікування першого кварталу

Створи фреймворк OKR для:`,
    category: "business",
  },

  // ==================== EDUCATION ====================
  {
    id: "course-curriculum",
    title: "Online Course Curriculum",
    titleRu: "Учебный план онлайн-курса",
    titleUa: "Навчальний план онлайн-курсу",
    description: "Complete course structure with learning outcomes, module breakdowns, assessments, and engagement strategies",
    descriptionRu: "Полная структура курса с результатами обучения, разбивкой модулей, оценками и стратегиями вовлечения",
    descriptionUa: "Повна структура курсу з результатами навчання, розбивкою модулів, оцінками та стратегіями залучення",
    icon: GraduationCap,
    example: "12-week data science bootcamp for career changers with no coding experience",
    exampleRu: "12-недельный буткемп по data science для сменяющих карьеру без опыта программирования",
    exampleUa: "12-тижневий буткемп з data science для тих, хто змінює карʼєру без досвіду програмування",
    defaultInput: `Act as an Instructional Designer who has created courses generating $10M+ in revenue. Design a comprehensive curriculum:

**COURSE OVERVIEW:**
- Course title and tagline
- Target learner profile
- Prerequisites (if any)
- Learning format (self-paced, cohort, hybrid)
- Total duration and time commitment
- Certification offered

**LEARNING OUTCOMES:**
By the end of this course, learners will be able to:
1. [Measurable outcome using action verb]
2. [Measurable outcome using action verb]
(5-8 outcomes total, using Bloom's taxonomy)

**COURSE STRUCTURE:**
For each module (8-12 modules):

**Module [N]: [Title]**
Duration: [X hours/days]

Learning Objectives:
- [Specific objective 1]
- [Specific objective 2]

Content Outline:
- Lesson 1: [Topic] (video length, readings)
- Lesson 2: [Topic] (video length, readings)
- Lesson 3: [Topic] (video length, readings)

Practical Application:
- Exercise description
- Project component
- Real-world scenario

Assessment:
- Quiz/test details
- Assignment description
- Rubric criteria

Resources:
- Required readings/materials
- Supplementary resources
- Tools/software needed

**ENGAGEMENT STRATEGY:**
- Community building activities
- Live session schedule
- Peer interaction opportunities
- Instructor touchpoints
- Gamification elements

**ASSESSMENT FRAMEWORK:**
- Formative assessments (ongoing)
- Summative assessments (end of module/course)
- Final project requirements
- Grading criteria and weights
- Feedback mechanisms

**LEARNER SUPPORT:**
- Office hours structure
- Discussion forum guidelines
- FAQ anticipation
- Technical support process

**ACCESSIBILITY:**
- Closed captions
- Transcript availability
- Screen reader compatibility
- Multiple format options

**SUCCESS METRICS:**
- Completion rate targets
- Engagement benchmarks
- Learning outcome assessment
- Student satisfaction (NPS)

**PRODUCTION PLAN:**
- Video specifications
- Interactive element requirements
- Platform features needed
- Content update schedule

Create curriculum for:`,
    defaultInputRu: `Действуй как Instructional Designer, создавший курсы с выручкой $10M+. Спроектируй комплексный учебный план:

**ОБЗОР КУРСА:**
- Название курса и слоган
- Профиль целевого учащегося
- Пререквизиты (если есть)
- Формат обучения (самостоятельный, когорта, гибрид)
- Общая длительность и временные затраты
- Предлагаемая сертификация

**РЕЗУЛЬТАТЫ ОБУЧЕНИЯ:**
По окончании этого курса учащиеся смогут:
1. [Измеримый результат с использованием глагола действия]
2. [Измеримый результат с использованием глагола действия]
(5-8 результатов, используя таксономию Блума)

**СТРУКТУРА КУРСА:**
Для каждого модуля (8-12 модулей):

**Модуль [N]: [Название]**
Длительность: [X часов/дней]

Цели обучения:
- [Конкретная цель 1]
- [Конкретная цель 2]

Содержание:
- Урок 1: [Тема] (длина видео, материалы для чтения)
- Урок 2: [Тема] (длина видео, материалы для чтения)
- Урок 3: [Тема] (длина видео, материалы для чтения)

Практическое применение:
- Описание упражнения
- Компонент проекта
- Реальный сценарий

Оценка:
- Детали квиза/теста
- Описание задания
- Критерии рубрики

Ресурсы:
- Обязательные материалы для чтения
- Дополнительные ресурсы
- Необходимые инструменты/ПО

**СТРАТЕГИЯ ВОВЛЕЧЕНИЯ:**
- Активности по построению сообщества
- Расписание живых сессий
- Возможности взаимодействия с коллегами
- Точки контакта с инструктором
- Элементы геймификации

**ФРЕЙМВОРК ОЦЕНИВАНИЯ:**
- Формативные оценки (ongoing)
- Суммативные оценки (конец модуля/курса)
- Требования к финальному проекту
- Критерии и веса оценивания
- Механизмы обратной связи

**ПОДДЕРЖКА УЧАЩИХСЯ:**
- Структура часов офиса
- Гайдлайны форума обсуждений
- Антиципация FAQ
- Процесс технической поддержки

**ДОСТУПНОСТЬ:**
- Субтитры
- Доступность транскриптов
- Совместимость со скринридерами
- Опции нескольких форматов

**МЕТРИКИ УСПЕХА:**
- Целевые показатели завершения
- Бенчмарки вовлечения
- Оценка результатов обучения
- Удовлетворённость студентов (NPS)

**ПЛАН ПРОИЗВОДСТВА:**
- Спецификации видео
- Требования к интерактивным элементам
- Необходимые функции платформы
- Расписание обновления контента

Создай учебный план для:`,
    defaultInputUa: `Дій як Instructional Designer, що створив курси з виручкою $10M+. Спроектуй комплексний навчальний план:

**ОГЛЯД КУРСУ:**
- Назва курсу та слоган
- Профіль цільового учня
- Пререквізити (якщо є)
- Формат навчання (самостійний, когорта, гібрид)
- Загальна тривалість та часові витрати
- Пропонована сертифікація

**РЕЗУЛЬТАТИ НАВЧАННЯ:**
По закінченні цього курсу учні зможуть:
1. [Вимірюваний результат з використанням дієслова дії]
2. [Вимірюваний результат з використанням дієслова дії]
(5-8 результатів, використовуючи таксономію Блума)

**СТРУКТУРА КУРСУ:**
Для кожного модуля (8-12 модулів):

**Модуль [N]: [Назва]**
Тривалість: [X годин/днів]

Цілі навчання:
- [Конкретна ціль 1]
- [Конкретна ціль 2]

Зміст:
- Урок 1: [Тема] (довжина відео, матеріали для читання)
- Урок 2: [Тема] (довжина відео, матеріали для читання)
- Урок 3: [Тема] (довжина відео, матеріали для читання)

Практичне застосування:
- Опис вправи
- Компонент проекту
- Реальний сценарій

Оцінка:
- Деталі квізу/тесту
- Опис завдання
- Критерії рубрики

Ресурси:
- Обовʼязкові матеріали для читання
- Додаткові ресурси
- Необхідні інструменти/ПЗ

**СТРАТЕГІЯ ЗАЛУЧЕННЯ:**
- Активності з побудови спільноти
- Розклад живих сесій
- Можливості взаємодії з колегами
- Точки контакту з інструктором
- Елементи гейміфікації

**ФРЕЙМВОРК ОЦІНЮВАННЯ:**
- Формативні оцінки (ongoing)
- Сумативні оцінки (кінець модуля/курсу)
- Вимоги до фінального проекту
- Критерії та ваги оцінювання
- Механізми зворотного звʼязку

**ПІДТРИМКА УЧНІВ:**
- Структура годин офісу
- Гайдлайни форуму обговорень
- Антиципація FAQ
- Процес технічної підтримки

**ДОСТУПНІСТЬ:**
- Субтитри
- Доступність транскриптів
- Сумісність зі скрінрідерами
- Опції кількох форматів

**МЕТРИКИ УСПІХУ:**
- Цільові показники завершення
- Бенчмарки залучення
- Оцінка результатів навчання
- Задоволеність студентів (NPS)

**ПЛАН ВИРОБНИЦТВА:**
- Специфікації відео
- Вимоги до інтерактивних елементів
- Необхідні функції платформи
- Розклад оновлення контенту

Створи навчальний план для:`,
    category: "education",
  },
  {
    id: "concept-explainer",
    title: "Expert Concept Explainer",
    titleRu: "Эксперт по объяснению концепций",
    titleUa: "Експерт з пояснення концепцій",
    description: "Multi-level explanations with analogies, examples, common misconceptions, and practice exercises",
    descriptionRu: "Многоуровневые объяснения с аналогиями, примерами, типичными заблуждениями и упражнениями",
    descriptionUa: "Багаторівневі пояснення з аналогіями, прикладами, типовими помилками та вправами",
    icon: Lightbulb,
    example: "Explain machine learning to someone with no technical background",
    exampleRu: "Объясни машинное обучение человеку без технического бэкграунда",
    exampleUa: "Поясни машинне навчання людині без технічного бекграунду",
    defaultInput: `Act as a world-class educator who can explain any concept to any audience. Create a comprehensive explanation:

**CONCEPT OVERVIEW:**
- One-sentence definition
- Why this concept matters
- Real-world relevance
- Who needs to understand this

**LAYERED EXPLANATIONS:**

**Level 1: ELI5 (Explain Like I'm 5)**
- Simple analogy from everyday life
- Visual description
- Core idea in one sentence

**Level 2: Beginner**
- Expanded explanation with simple terms
- Relatable everyday example
- Key vocabulary introduction (3-5 terms)
- What it looks like in practice

**Level 3: Intermediate**
- Technical details and mechanisms
- How it works step by step
- Connections to related concepts
- Industry applications

**Level 4: Advanced**
- Deep technical dive
- Edge cases and nuances
- Current research and developments
- Expert-level terminology

**ANALOGIES & METAPHORS:**
Provide 3-5 different analogies:
1. [Analogy] - Best for [type of learner]
2. [Analogy] - Best for [type of learner]
(Match analogies to different backgrounds: visual, mathematical, narrative, etc.)

**CONCRETE EXAMPLES:**
- Simple example with walkthrough
- Complex real-world case study
- Counter-example (what this is NOT)

**COMMON MISCONCEPTIONS:**
For each misconception:
- The wrong belief
- Why people believe it
- The correct understanding
- How to remember the truth

**HISTORICAL CONTEXT:**
- How this concept developed
- Key figures and their contributions
- Evolution over time
- Future directions

**CONNECTIONS:**
- Prerequisites (what to learn first)
- Related concepts
- How this builds to more advanced topics
- Cross-disciplinary applications

**PRACTICE & ASSESSMENT:**
- 3 thought experiments
- 5 self-check questions with answers
- Hands-on activity suggestion
- Resources for further learning

**TEACHING TIPS:**
- Common sticking points for learners
- Best sequence for teaching
- Activities that work well
- Signs of understanding to look for

Explain this concept:`,
    defaultInputRu: `Действуй как педагог мирового класса, способный объяснить любую концепцию любой аудитории. Создай комплексное объяснение:

**ОБЗОР КОНЦЕПЦИИ:**
- Определение в одном предложении
- Почему эта концепция важна
- Релевантность в реальном мире
- Кому нужно это понимать

**УРОВНЕВЫЕ ОБЪЯСНЕНИЯ:**

**Уровень 1: Объясни как пятилетнему**
- Простая аналогия из повседневной жизни
- Визуальное описание
- Ключевая идея в одном предложении

**Уровень 2: Начинающий**
- Расширенное объяснение простыми терминами
- Понятный повседневный пример
- Введение ключевой лексики (3-5 терминов)
- Как это выглядит на практике

**Уровень 3: Средний**
- Технические детали и механизмы
- Как это работает пошагово
- Связи с близкими концепциями
- Индустриальные применения

**Уровень 4: Продвинутый**
- Глубокое техническое погружение
- Граничные случаи и нюансы
- Текущие исследования и разработки
- Терминология экспертного уровня

**АНАЛОГИИ И МЕТАФОРЫ:**
Предоставь 3-5 разных аналогий:
1. [Аналогия] - Лучше для [типа учащегося]
2. [Аналогия] - Лучше для [типа учащегося]
(Сопоставь аналогии с разными бэкграундами: визуальный, математический, нарративный и т.д.)

**КОНКРЕТНЫЕ ПРИМЕРЫ:**
- Простой пример с разбором
- Сложный реальный кейс
- Контрпример (чем это НЕ является)

**ТИПИЧНЫЕ ЗАБЛУЖДЕНИЯ:**
Для каждого заблуждения:
- Ошибочное убеждение
- Почему люди в это верят
- Правильное понимание
- Как запомнить истину

**ИСТОРИЧЕСКИЙ КОНТЕКСТ:**
- Как эта концепция развивалась
- Ключевые фигуры и их вклад
- Эволюция во времени
- Будущие направления

**СВЯЗИ:**
- Пререквизиты (что изучить сначала)
- Связанные концепции
- Как это ведёт к более продвинутым темам
- Междисциплинарные применения

**ПРАКТИКА И ОЦЕНКА:**
- 3 мысленных эксперимента
- 5 вопросов для самопроверки с ответами
- Предложение практической активности
- Ресурсы для дальнейшего изучения

**СОВЕТЫ ПО ОБУЧЕНИЮ:**
- Типичные затыки для учащихся
- Лучшая последовательность для обучения
- Активности, которые хорошо работают
- Признаки понимания, на которые смотреть

Объясни эту концепцию:`,
    defaultInputUa: `Дій як педагог світового класу, здатний пояснити будь-яку концепцію будь-якій аудиторії. Створи комплексне пояснення:

**ОГЛЯД КОНЦЕПЦІЇ:**
- Визначення в одному реченні
- Чому ця концепція важлива
- Релевантність у реальному світі
- Кому потрібно це розуміти

**РІВНЕВІ ПОЯСНЕННЯ:**

**Рівень 1: Поясни як пʼятирічному**
- Проста аналогія з повсякденного життя
- Візуальний опис
- Ключова ідея в одному реченні

**Рівень 2: Початківець**
- Розширене пояснення простими термінами
- Зрозумілий повсякденний приклад
- Введення ключової лексики (3-5 термінів)
- Як це виглядає на практиці

**Рівень 3: Середній**
- Технічні деталі та механізми
- Як це працює покроково
- Звʼязки з близькими концепціями
- Індустріальні застосування

**Рівень 4: Просунутий**
- Глибоке технічне занурення
- Граничні випадки та нюанси
- Поточні дослідження та розробки
- Термінологія експертного рівня

**АНАЛОГІЇ ТА МЕТАФОРИ:**
Надай 3-5 різних аналогій:
1. [Аналогія] - Краще для [типу учня]
2. [Аналогія] - Краще для [типу учня]
(Зіставити аналогії з різними бекграундами: візуальний, математичний, наративний тощо)

**КОНКРЕТНІ ПРИКЛАДИ:**
- Простий приклад з розбором
- Складний реальний кейс
- Контрприклад (чим це НЕ є)

**ТИПОВІ ПОМИЛКИ:**
Для кожної помилки:
- Хибне переконання
- Чому люди в це вірять
- Правильне розуміння
- Як запамʼятати істину

**ІСТОРИЧНИЙ КОНТЕКСТ:**
- Як ця концепція розвивалася
- Ключові фігури та їх внесок
- Еволюція в часі
- Майбутні напрямки

**ЗВʼЯЗКИ:**
- Пререквізити (що вивчити спочатку)
- Повʼязані концепції
- Як це веде до більш просунутих тем
- Міждисциплінарні застосування

**ПРАКТИКА ТА ОЦІНКА:**
- 3 уявні експерименти
- 5 питань для самоперевірки з відповідями
- Пропозиція практичної активності
- Ресурси для подальшого вивчення

**ПОРАДИ ЩОДО НАВЧАННЯ:**
- Типові затики для учнів
- Найкраща послідовність для навчання
- Активності, що добре працюють
- Ознаки розуміння, на які дивитися

Поясни цю концепцію:`,
    category: "education",
  },
];

export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  return templates.filter(t => t.category === category);
};

export const getLocalizedTemplate = (template: Template, language: string) => {
  const lang = language as "en" | "ru" | "ua";
  return {
    ...template,
    title: lang === "ru" ? template.titleRu : lang === "ua" ? template.titleUa : template.title,
    description: lang === "ru" ? template.descriptionRu : lang === "ua" ? template.descriptionUa : template.description,
    example: lang === "ru" ? template.exampleRu : lang === "ua" ? template.exampleUa : template.example,
    defaultInput: lang === "ru" ? template.defaultInputRu : lang === "ua" ? template.defaultInputUa : template.defaultInput,
  };
};

export const getLocalizedCategory = (category: CategoryInfo, language: string) => {
  const lang = language as "en" | "ru" | "ua";
  return {
    ...category,
    label: lang === "ru" ? category.labelRu : lang === "ua" ? category.labelUa : category.label,
  };
};
