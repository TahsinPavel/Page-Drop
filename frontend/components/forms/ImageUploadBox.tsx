"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";

interface ImageUploadBoxProps {
    label: string;
    hint: string;
    currentImageUrl?: string | null;
    onFileSelect: (file: File) => void;
    onRemove?: () => void;
    aspectRatio?: string;
    loading?: boolean;
}

export default function ImageUploadBox({
    label,
    hint,
    currentImageUrl,
    onFileSelect,
    onRemove,
    aspectRatio = "16 / 9",
    loading = false,
}: ImageUploadBoxProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const hasImage = Boolean(currentImageUrl);

    const wrapperStyle = useMemo(
        () => ({
            aspectRatio,
        }),
        [aspectRatio]
    );

    const pickFile = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            const file = files?.[0];
            if (!file) {
                return;
            }
            onFileSelect(file);
        },
        [onFileSelect]
    );

    const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
        },
        [handleFiles]
    );

    const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(true);
        },
        []
    );

    const onDragLeave: React.DragEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(false);
        },
        []
    );

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
            />

            {!hasImage ? (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={pickFile}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            pickFile();
                        }
                    }}
                    className={[
                        "rounded-xl border-[1.5px] border-dashed px-6 py-8 text-center transition-all duration-200 ease-out",
                        "cursor-pointer",
                        isDragging
                            ? "border-indigo-400 bg-indigo-500/10"
                            : "border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-400 hover:bg-indigo-500/10",
                    ].join(" ")}
                >
                    <UploadCloud className="mx-auto h-8 w-8 text-indigo-400/80" />
                    <p className="mt-3 text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                    <p className="mt-1 text-xs text-muted-foreground">or drag and drop</p>
                </div>
            ) : (
                <div
                    style={wrapperStyle}
                    className="group relative overflow-hidden rounded-xl border border-border"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                >
                    <Image
                        src={currentImageUrl ?? ""}
                        alt={label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={pickFile}
                            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black shadow"
                        >
                            Change
                        </button>
                        {onRemove ? (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="rounded-md border border-red-400/60 bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-200"
                            >
                                Remove
                            </button>
                        ) : null}
                    </div>

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55">
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                            <span className="text-xs font-medium text-white">Uploading...</span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
