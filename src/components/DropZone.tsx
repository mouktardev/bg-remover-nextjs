"use client"

import { useRowIds, useStore } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { AutoModel, AutoProcessor, PreTrainedModel, Processor, RawImage, env } from '@huggingface/transformers';
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone, } from "react-dropzone";
import { LuDownload, LuLoader2, LuPlay } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button } from './ui/Button';

export default function DropZone() {
    const [isLoadingModel, setIsLoadingModel] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<Error>();
    const storeReference = useStore();
    const rowIds = useRowIds("images")

    const modelRef = useRef<PreTrainedModel | null>(null);
    const processorRef = useRef<Processor | null>(null);

    useEffect(() => {
        (async () => {
            if (typeof window !== 'undefined' && 'gpu' in navigator) {
                try {
                    if (!navigator.gpu) {
                        throw new Error("WebGPU is not supported in this browser.");
                    }
                    const model_id = "briaai/RMBG-1.4";
                    // Use optional chaining to avoid 'possibly undefined' error
                    env?.backends?.onnx?.wasm && (env.backends.onnx.wasm.proxy = false)
                    modelRef.current ??= await AutoModel.from_pretrained(model_id, {
                        device: "webgpu",
                    });
                    processorRef.current ??= await AutoProcessor.from_pretrained(model_id);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err);
                    }
                }
                setIsLoadingModel(false);
            }
        })();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        storeReference?.transaction(() => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const base64String = reader.result as string;
                    const img = new Image();
                    img.src = base64String;
                    img.onload = () => {
                        storeReference.addRow('images', {
                            name: file.name,
                            size: file.size,
                            imageUrl: base64String, // Save base64 string instead
                            mediaType: file.type,
                            height: img.height,
                            width: img.width,
                        });
                    }
                }
                reader.onerror = (error) => {
                    toast.error(`Error converting file to base64:${error}`);
                };
            })
        })
    }, [storeReference]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
        },
    });


    const processImages = async () => {
        setIsProcessing(true);
        const model = modelRef.current;
        const processor = processorRef.current;
        for (let i = 0; i < rowIds.length; ++i) {
            if (storeReference?.getCell("images", `${rowIds[i]}`, "transformedImageUrl")) {
                continue
            }
            // Load image
            const img = await RawImage.fromURL(storeReference?.getCell("images", `${rowIds[i]}`, "imageUrl") as string);
            if (processor && model) {
                // Pre-process image
                const { pixel_values } = await processor(img);
                // Predict alpha matte
                const { output } = await model({ input: pixel_values });
                const maskData = (
                    await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
                        img.width,
                        img.height,
                    )
                ).data;

                // Create new canvas
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Draw original image output to canvas
                    ctx.drawImage(img.toCanvas(), 0, 0);

                    // Update alpha channel
                    const pixelData = ctx.getImageData(0, 0, img.width, img.height);
                    for (let i = 0; i < maskData.length; ++i) {
                        pixelData.data[4 * i + 3] = maskData[i];
                    }
                    ctx.putImageData(pixelData, 0, 0);
                    storeReference?.transaction(() => {
                        storeReference?.setCell("images", `${rowIds[i]}`, "transformedImageUrl", canvas.toDataURL("image/png"))
                        storeReference?.setCell("images", `${rowIds[i]}`, "width", canvas.width)
                        storeReference?.setCell("images", `${rowIds[i]}`, "height", canvas.width)
                        storeReference?.setCell("images", `${rowIds[i]}`, "mediaType", "image/png")
                    })
                }
            }
        }
        setIsProcessing(false);
    };

    const downloadAsZip = async () => {
        const zip = new JSZip();
        const promises = rowIds.map(
            (rowId) =>
                new Promise((resolve) => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const name = storeReference?.getCell("images", rowId, "name") as string
                    const transformedImageUrl = storeReference?.getCell("images", rowId, "transformedImageUrl") as string
                    const imageUrl = storeReference?.getCell("images", rowId, "imageUrl") as string
                    const img = new Image();
                    img.src = transformedImageUrl || imageUrl
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob((blob) => {
                                if (blob) {
                                    zip.file(name, blob);
                                }
                                resolve(null);
                            }, "image/png");
                        }
                    };
                }),
        );

        await Promise.all(promises);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images.zip");
    };


    if (error) {
        return (
            <div className='space-y-3'>
                <h2 className="mb-2 text-lg text-danger">ERROR</h2>
                <div className="rounded-md border border-danger/20 bg-dangerForeground px-2 py-1">
                    <p className='text-danger'>{error.message}</p>
                </div>
            </div>
        );
    }
    if (isLoadingModel) {
        return (
            <div className='flex flex-col items-center rounded-lg border-2 border-dashed border-accent p-8'>
                <LuLoader2 className="size-8 animate-spin text-primary" />
                <p className="text-lg text-secondary">Loading background removal model...</p>
            </div>
        );
    }
    return (
        <div className='space-y-5'>
            <div
                {...getRootProps()}
                className={cn(
                    isDragAccept ? "border-success bg-success/20" :
                        isDragReject ? "border-danger bg-danger/20" :
                            isDragActive && "border-action bg-action/20",
                    "mb-8 cursor-pointer rounded-lg border-2 border-dashed p-8 border-accent hover:border-action hover:bg-action/10 text-center transition-colors duration-300 ease-in-out")}
            >
                <input {...getInputProps()} className="hidden" />
                <p className="mb-2 text-lg">
                    {isDragActive
                        ? "Drop the images here..."
                        : "Drag and drop some images here"}
                </p>
                <p className="text-sm text-secondary">or click to select files</p>
            </div>
            <div className="flex flex-col">
                {storeReference?.hasTable("images") &&
                    <div className="flex gap-5">
                        <Button
                            type='button'
                            onClick={processImages}
                            disabled={isProcessing}
                            variant="action"
                        >
                            {isProcessing ?
                                <>
                                    <LuLoader2 className='mr-2 size-4 animate-spin' />
                                    Processing...
                                </>
                                :
                                <>
                                    <LuPlay className='mr-2 size-4' />
                                    Process
                                </>
                            }
                        </Button>
                        <Button
                            type='button'
                            onClick={downloadAsZip}
                            variant="success"
                        >
                            <LuDownload className='mr-2 size-4' />
                            Download all
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}
