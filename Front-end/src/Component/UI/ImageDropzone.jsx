import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FieldLabel, FieldError } from "@/components/ui/field";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  register,
  name,
  preview,
  fallbackPreview,
  onFileChange,
  onClear,
  error,
  required,
  label = "Photo",
  hint = "PNG, JPG jusqu'à 5MB",
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { ref, ...fieldProps } = register(name, {
    ...(required ? { required } : {}),
    onChange: onFileChange,
  });

  const displayPreview = preview || fallbackPreview;
  const canClear = true;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !inputRef.current) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      inputRef.current.files = dataTransfer.files;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
    onClear?.();
  };
  
 

  return (
    <div>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "mt-1.5 flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-3 transition-colors",
          isDragging
            ? "border-[#0050CB] bg-blue-50/60"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <div className="relative shrink-0">
          <Avatar size="lg" className="size-14 rounded-md">
            {displayPreview ? (
              <AvatarImage src={displayPreview} alt="Aperçu" className="rounded-md" />
            ) : (
              <AvatarFallback className="rounded-md">
                <ImageIcon className="h-5 w-5 text-slate-400" />
              </AvatarFallback>
            )}
          </Avatar>
          {canClear && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Supprimer l'image"
              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-[#0050CB]">
              Cliquez pour téléverser
            </span>{" "}
            ou glissez-déposez
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
        </div>
        <UploadCloud className="h-5 w-5 shrink-0 text-slate-300" />
        <input
          id={name}
          type="file"
          accept="image/*"
          className="hidden"
          ref={(el) => {
            ref(el);
            inputRef.current = el;
          }}
          {...fieldProps}
        />
      </div>
      {error && <FieldError>{error.message}</FieldError>}
    </div>
  );
}
