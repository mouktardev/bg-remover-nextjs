# Remove Background

A simple Next js app client side for running [MODNet](https://huggingface.co/Xenova/modnet), tiny portrait background removal model, locally in the browser using Transformers.js and WebGPU-acceleration.
This example is inspired by [Xenova](https://x.com/xenovacom) check his repo [here](https://github.com/huggingface/transformers.js-examples/tree/main/remove-background-webgpu)

## Added features :

Storig and Query Client side:-

- [TinyBase](https://tinybase.org/) store data and use [TinyQL](https://tinybase.org/guides/using-queries/tinyql/) for search and query client side with the help of nextjs [searchparams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

UI accessible components:-

- [react aria components](https://react-spectrum.adobe.com/react-aria/index.html) component like Table ,Dialog ,Select and more.

## Video for a demo

---

## Persistence layer

TinyBase offer different [persistence](https://tinybase.org/guides/persistence/) modules to store data in longer-term.
for example to persist on indexeddb all you have to do is this in `Provider.tsx`

```ts
useCreatePersister(
  store,
  (store) => {
    return createIndexedDbPersister(store, "store");
  },
  [],
  async (persister) => {
    await persister?.startAutoLoad();
    await persister?.startAutoSave();
  }
);
```

## Run it locally

```sh
git clone https://github.com/mouktardev/bg-remover-nextjs.git

```

```sh
cd /bg-remover-nextjs
```

```sh
npm i
```

```sh
npm run dev
```

Make sure your browser support graphics acceleration, the application should now be running locally. Open your browser and go to `http://localhost:3000` to see it in action.

> find me on x [@mouktardev](https://x.com/mouktardev) or threads [@mouktardev](https://www.threads.net/@mouktardev)
