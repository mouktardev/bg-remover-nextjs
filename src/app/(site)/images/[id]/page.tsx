import ImageView from '@/components/ImageView'
import { Metadata } from 'next'

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const id = params.id
    return {
        title: `image ${id}`,
        description: `image ${id}`,
    }
}

export default function page({ params: { id } }: Props) {
    return (
        <section className='mx-auto flex flex-1 flex-col gap-10 px-4 py-10 md:w-[840px]'>
            <ImageView rowId={id} />
        </section>
    )
}