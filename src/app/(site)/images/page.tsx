import DropZone from "@/components/DropZone";
import ImageGallery from "@/components/ImageGallery";

export default function page() {
  return (
    <section className='mx-auto flex max-w-[100dvw] flex-1 flex-col gap-10 px-4 py-10 md:w-[840px]'>
      <DropZone />
      <ImageGallery />
    </section>
  )
}