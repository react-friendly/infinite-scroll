# 📜 react-friendly/infinite-scroll

A sleek, generic, and fully controlled infinite scroll component for React — built with TypeScript, imperatively controllable, and customizable to the last pixel.

![npm version](https://img.shields.io/npm/v/@react-friendly/infinite-scroll)
![license](https://img.shields.io/npm/l/@react-friendly/infinite-scroll)
![types](https://img.shields.io/npm/types/@react-friendly/infinite-scroll)
![npm downloads](https://img.shields.io/npm/dw/@react-friendly/infinite-scroll)

## 🔧 Installation

```sh
npm install @react-friendly/infinite-scroll
```

or

```sh
yarn add @react-friendly/infinite-scroll
```

## 🚀 Quick Example

```tsx
import React from 'react';
import InfiniteScroll from '@react-friendly/infinite-scroll';

interface Post {
    id: number;
    title: string;
}

function PostList() {
    const fetchPosts = async (offset: number): Promise<{ items: Post[], total: number, offset: number }> => {
        const response = await fetch(`/api/posts?offset=${offset}`);
        const data = await response.json();

        return data;
    };

    return (
        <InfiniteScroll
            loadItems={fetchPosts}
            renderItem={(item) => <div key={item.id}>{item.title}</div>}
        />
    );
}
```

## 📘 Using `page` & `limit` Pagination APIs

If your API uses `page`, `limit`, and `total` instead of `offset`, no problem — just adapt the request logic accordingly.

```tsx
import React from 'react';
import InfiniteScroll from '@react-friendly/infinite-scroll';

interface Post {
    id: number;
    title: string;
}

function PostList() {
    const fetchPosts = async (offset: number): Promise<{ items: Post[]; total: number; offset: number }> => {
        const limit = 10;
        // Converts offset-based pagination to page number (1-based index)
        const page = Math.floor(offset / limit) + 1;

        const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
        const data = await response.json();

        return {
            items: data.data,
            total: data.total,
            offset: offset,
        };
    };

    return (
        <InfiniteScroll
            loadItems={fetchPosts}
            renderItem={(item) => <div key={item.id}>{item.title}</div>}
        />
    );
}
```

Your API call stays clean, and the component still receives the correct items, total, and original offset. Seamless integration, regardless of backend pagination style.

## ⚙️ Props

| Prop               | Type                                              | Description |
|--------------------|---------------------------------------------------|-------------|
| `loadItems`        | `(offset: number) => Promise<ResponseData<T>>`   | Async function to fetch more items. |
| `renderItem`       | `(item: T) => React.ReactNode`                   | Render logic for each item. |
| `loadingComponent` | `React.ReactNode`                                | Optional loading indicator. |
| `errorComponent`   | `React.ReactNode`                                | Optional error fallback UI. |
| `reverse`          | `boolean`                                        | If `true`, renders items in reverse scroll (e.g., chat apps). |
| `style`            | `React.CSSProperties`                            | Custom styles for scroll container. |
| `className`        | `string`                                         | Custom class name. |

## 🔁 Ref API (InfiniteScrollHandle<T>)

Access the component's internal logic via ref:

```tsx
const ref = useRef<InfiniteScrollHandle<T>>(null);
```

| Method | Description |
| -------- | --------- |
| `reload()` | Reloads the list from scratch. |
| `replace(predicate, itemToReplace)` | Updates a matching item using your predicate logic. |
| `remove(predicate)` | Removes an item based on a predicate. |
| `getItems()` | Returns the currently loaded list of items. |
| `push(newItem)` | Appends a new item manually and updates the total count. |
| `unshift(newItem)` | Prepends a new item to the beginning of the list and updates the total count. |

## 🔄 Reverse Mode Example (Chat UI)

```tsx
<InfiniteScroll
    reverse
    loadItems={loadMessages}
    renderItem={(msg) => (
        <div key={msg.id}>
            <b>{msg.user}</b>: {msg.text}
        </div>
    )}
/>
```

## 🧱 ResponseData<T>

The loadItems function must return the following structure:

```ts
interface ResponseData<T> {
    items: T[];
    total: number;  // total number of items on the server
    offset: number; // current offset (usually passed in the request)
}
```

## 🧪 Test with Mock API

```tsx
const mockLoad = async (offset: number): Promise<ResponseData<number>> => {
    await new Promise(r => setTimeout(r, 500)); // simulate latency
    
    return {
        items: Array.from({ length: 10 }, (_, i) => offset + i + 1),
        total: 100,
        offset,
    };
};
```

## 💡 Tips

Use reverse mode for chat interfaces with flexDirection: column-reverse.

The scroll container automatically observes a sentinel element for triggering loads.

You can debounce or throttle loadItems if needed (though the built-in logic prevents duplicate requests).

Ideal for dashboards, timelines, chats, feeds, etc.

## 🧑‍💻 Contributors

| Photo | Name | Links |
| ----- | ---- | ------ |
| <img src="https://avatars.githubusercontent.com/u/28657322?v=4" width="80" alt="Gabriel" /> | Gabriel | [GitHub](https://github.com/gabrielrfmendes) |
| <img src="https://avatars.githubusercontent.com/u/69215425?v=4" width="80" alt="Tarsis" /> | Tarsis | [GitHub](https://github.com/tarsislimadev) |

## 🧾 License
[MIT](./LICENSE) © react-friendly
