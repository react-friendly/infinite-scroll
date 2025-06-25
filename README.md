# 📜 react-friendly/infinite-scroll

A sleek, generic, and fully controlled infinite scroll component for React — built with TypeScript, imperatively controllable, and customizable to the last pixel.

## 🔧 Installation
``bash
npm install @react-friendly/infinite-scroll
``

or

``bash
yarn add @react-friendly/infinite-scroll
``

## 🚀 Quick Example
``tsx
import React, { useRef } from 'react';
import InfiniteScroll, { InfiniteScrollHandle } from '@react-friendly/infinite-scroll';

interface Post {
  id: number;
  title: string;
}

function PostList() {
  const scrollRef = useRef<InfiniteScrollHandle<Post>>(null);

  const fetchPosts = async (offset: number): Promise<{ items: Post[], total: number, offset: number }> => {
    const res = await fetch(`/api/posts?offset=${offset}`);
    const data = await res.json();
    return data;
  };

  return (
    <InfiniteScroll<Post>
      ref={scrollRef}
      limit={10}
      loadItems={fetchPosts}
      renderItem={(item) => <div key={item.id}>{item.title}</div>}
    />
  );
}
``

## ⚙️ Props

Prop	Type	Description
loadItems	(offset: number) => Promise<ResponseData<T>>	Async function to fetch more items.
renderItem	(item: T) => React.ReactNode	Render logic for each item.
limit	number	Item batch size per request (used internally in loadItems).
loadingComponent	React.ReactNode	Optional loading indicator.
errorComponent	React.ReactNode	Optional error fallback UI.
reverse	boolean	If true, renders items in reverse scroll (e.g., chat apps).
style	React.CSSProperties	Custom styles for scroll container.
className	string	Custom class name.

## 🔁 Ref API (InfiniteScrollHandle<T>)

Access the component's internal logic via ref:

``tsx
const ref = useRef<InfiniteScrollHandle<T>>(null);
Method	Description
reload()	Reloads the list from scratch.
updateItem(item, predicate)	Updates a matching item using your predicate logic.
removeItem(predicate)	Removes an item based on a predicate.
getItems()	Returns the currently loaded list of items.
addItem(newItem)	Appends a new item manually.
``

## 🔄 Reverse Mode Example (Chat UI)

``tsx

<InfiniteScroll<Message>
  ref={scrollRef}
  limit={20}
  reverse
  loadItems={loadMessages}
  renderItem={(msg) => (
    <div key={msg.id}>
      <b>{msg.user}</b>: {msg.text}
    </div>
  )}
/>
``

## 🧱 ResponseData<T>

The loadItems function must return the following structure:

``ts
interface ResponseData<T> {
  items: T[];
  total: number;  // total number of items on the server
  offset: number; // current offset (usually passed in the request)
}
``

##🧪 Test with Mock API

``tsx
const mockLoad = async (offset: number): Promise<ResponseData<number>> => {
  await new Promise(r => setTimeout(r, 500)); // simulate latency
  return {
    items: Array.from({ length: 10 }, (_, i) => offset + i + 1),
    total: 100,
    offset,
  };
};
``

## 💡 Tips
Use reverse mode for chat interfaces with flexDirection: column-reverse.

The scroll container automatically observes a sentinel element for triggering loads.

You can debounce or throttle loadItems if needed (though the built-in logic prevents duplicate requests).

Ideal for dashboards, timelines, chats, feeds, etc.

## 🧾 License
[MIT](./LICENSE) © Gabriel and Tarsis
