import { ModalImage } from '@/components/ModalImage';
import type { Metadata } from 'next';

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const id = params.id
    return {
        title: `image ${id}`,
        description: `image ${id}`,
        creator: "Mouktar Aden",
    }
}

export default function PhotoModal({ params: { id } }: Props) {
    return <ModalImage rowId={id} />
}