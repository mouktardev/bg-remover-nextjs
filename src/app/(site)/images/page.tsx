import DropZone from "@/components/DropZone";
import ImageGallery from "@/components/ImageGallery";
import { Suspense } from "react";

export default function page() {
  return (
    <section className='mx-auto flex max-w-[100dvw] flex-1 flex-col gap-10 px-4 py-10 md:w-[840px]'>
      <div className="mx-auto">
        <h1 className="text-lg text-primary md:text-2xl">Client side web gpu background remover</h1>
        <p className="text-secondary">powered by <a href="https://github.com/xenova/transformers.js" className="text-action" target="_blank">Transformers.js</a></p>
      </div>
      <DropZone />
      <Suspense>
        <ImageGallery />
      </Suspense>
    </section>
  )
}