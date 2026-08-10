# Друзья и уведомления — контракт для фронта

Все REST-пути ниже даны без префикса `/api/v1` (он добавляется глобально, как и для остальных эндпоинтов). Авторизация — тот же JWT-механизм, что и везде.

## Друзья — `/friend`

### `POST /friend/send-request`

Отправить заявку в друзья (или переоткрыть отклонённую, или авто-принять встречную).

**Body:**
```ts
{ addresseeId: string }
```

**Response — `FriendshipActionDto`:**
```ts
{
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string; // ISO
  otherUser: FriendUser; // всегда собеседник, не важно кто заявитель
}
```

**Важное поведение, которое нужно учитывать в UI:**
- Метод идемпотентен: повторный вызов на уже существующую `PENDING`-заявку просто вернёт её, не создаст дубль.
- Если собеседник **уже** отправил вам встречную заявку — она автоматически примется, `status` в ответе будет сразу `ACCEPTED` (не `PENDING`). Не полагайтесь на то, что после `send-request` всегда будет `PENDING` — проверяйте `status` в ответе.
- Если заявка была отклонена ранее — можно отправить снова, статус вернётся в `PENDING`.

**Ошибки:**
| Код | Причина |
|---|---|
| 400 | `Cannot add yourself as a friend` — попытка добавить самого себя |
| 401 | не авторизован |

---

### `POST /friend/:id/accept`

Принять входящую заявку. `:id` — id записи `Friendship` (из `GET /friend/incoming`), не userId.

**Response — `FriendshipActionDto`** (см. выше, `status` будет `ACCEPTED`, `otherUser` — тот, кто прислал заявку).

**Ошибки:**
| Код | Причина |
|---|---|
| 404 | `Request not found` — заявки нет, она не вам адресована, или уже не `PENDING` |

---

### `POST /friend/:id/decline`

Отклонить входящую заявку. Тот же контракт, что и `accept`, `status` в ответе будет `DECLINED`. Автору заявки уведомление **не** отправляется — она просто исчезает из его исходящих.

**Ошибки:** те же, что у `accept`.

---

### `DELETE /friend/:id`

Удалить из друзей. `:id` — id записи `Friendship` из списка друзей (`GET /friend`).

**Response — `FriendshipActionDto`** (данные о собеседнике на момент удаления; `status` в ответе — это статус *до* удаления, то есть `ACCEPTED`, отдельного статуса типа `REMOVED` нет).

**Ошибки:**
| Код | Причина |
|---|---|
| 404 | `You are not a friends` — записи нет, она не ваша, или не в статусе `ACCEPTED` |

---

### `GET /friend`

Список друзей (статус `ACCEPTED`, в любую сторону).

**Response — `FriendDto[]`:**
```ts
{ id: string; createdAt: string; friend: FriendUser }[]
```

### `GET /friend/incoming`

Входящие заявки (вам, `PENDING`).

**Response — `IncomingFriendRequestDto[]`:**
```ts
{ id: string; createdAt: string; fromUser: FriendUser }[]
```

### `GET /friend/outgoing`

Исходящие заявки (от вас, `PENDING`, ещё без ответа).

**Response — `OutgoingFriendRequestDto[]`:**
```ts
{ id: string; createdAt: string; toUser: FriendUser }[]
```

---

### Общий тип `FriendUser`

Используется во всех ответах выше как `friend`/`fromUser`/`toUser`/`otherUser`:

```ts
interface FriendUser {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeenAt: string | null; // ISO, null пока онлайн
}
```

## Уведомления — `/notification`

### `GET /notification?limit=20&offset=0&unreadOnly=false`

- `limit` — 1-50, по умолчанию 20.
- `offset` — по умолчанию 0.
- `unreadOnly` — `true`/`false`, по умолчанию `false`.

**Response:**
```ts
{
  notifications: {
    id: string;
    type: string;
    payload: Record<string, unknown>;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
  }[];
  count: number; // всего записей под текущий фильтр, для пагинации
}
```

### `PATCH /notification/:id/read`

Пометить одно уведомление прочитанным. Идемпотентно — повторный вызов не ошибка. Response — то же уведомление (форма как в списке выше).

**Ошибки:** 404, если уведомление не найдено или не ваше.

### `PATCH /notification/read-all`

Пометить все прочитанными. **Response:** `{ updated: number }`.

### `GET /notification/unread-count`

**Response:** число (не объект) — счётчик непрочитанных.

## Real-time — сокет-события

Специально подписываться не нужно — как только сокет подключился и прошёл авторизацию, он уже состоит в комнате `user:{ваш userId}`, события приходят туда сами.

| Событие | Payload | Когда |
|---|---|---|
| `notification:new` | `{ notification: NotificationDto }` | Создано новое уведомление (см. `payload` формы выше) |
| `notification:read` | `{ notificationId: string }` | Уведомление помечено прочитанным (в т.ч. с другой вкладки/устройства) |
| `notification:allRead` | `{}` | Все уведомления помечены прочитанными (в т.ч. с другой вкладки/устройства) |

## Типы уведомлений, которые сейчас реально создаются

| `type` | Когда шлётся | `payload` |
|---|---|---|
| `FRIEND_REQUEST` | Пришла новая (или переоткрытая) заявка в друзья | `{ fromUserId: string }` |
| `FRIEND_ACCEPTED` | Вашу заявку приняли (вручную или авто, при встречной заявке) | `{ fromUserId: string }` |

На отклонение заявки и на удаление из друзей уведомления не отправляются — это осознанное решение, не баг.
