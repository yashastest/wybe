
import React from "react";
import { X, ImageIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  id: string;
  label: string;
  aspectRatio?: number;
  className?: string;
  maxSizeMB?: number;
  imageClassName?: string;
  buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageUpload,
  onImageRemove,
  id,
  label,
  aspectRatio = 1,
  className = "",
  maxSizeMB = 2,
  imageClassName = "",
  buttonVariant = "outline",
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to maxSizeMB)
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image size should be less than ${maxSizeMB}MB`);
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }
      
      onImageUpload(e);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {imagePreview ? (
        <div className="relative">
          <div className={`overflow-hidden border-2 border-wybe-primary ${imageClassName}`}>
            <AspectRatio ratio={aspectRatio} className="bg-muted">
              <img 
                src={imagePreview} 
                alt={label} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          <Button 
            type="button"
            variant="destructive" 
            size="sm"
            className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
            onClick={onImageRemove}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <label htmlFor={id} className="cursor-pointer w-full">
          <div className="border border-dashed border-wybe-primary/40 rounded-lg p-6 text-center hover:bg-wybe-primary/10 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                {aspectRatio === 1 ? (
                  <ImageIcon size={24} className="text-wybe-primary" />
                ) : (
                  <UploadIcon size={24} className="text-wybe-primary" />
                )}
              </div>
              <p className="text-sm text-gray-400">
                Click to upload {label.toLowerCase()}
              </p>
            </div>
          </div>
        </label>
      )}
      <input
        type="file"
        id={id}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imagePreview && (
        <label htmlFor={id}>
          <Button 
            type="button" 
            variant={buttonVariant}
            className="cursor-pointer"
            asChild
          >
            <span>Change {label}</span>
          </Button>
        </label>
      )}
    </div>
  );
};

export { ImageUpload };
