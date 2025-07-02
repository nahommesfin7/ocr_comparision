interface ImagePreviewProps {
  image: string | null;
  preprocessedImageUrl: string | null;
}

const ImagePreview = ({ image, preprocessedImageUrl }: ImagePreviewProps) => {
  if (!image) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-50 border">
          <h4 className="text-sm font-medium text-gray-900 p-2">Original Image</h4>
          <img 
            src={image} 
            alt="Original" 
            className="max-h-[400px] w-full object-contain"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg bg-gray-50 border">
          <h4 className="text-sm font-medium text-gray-900 p-2">Preprocessed Image</h4>
          <img 
            src={preprocessedImageUrl} 
            alt="Preprocessed" 
            className="max-h-[400px] w-full object-contain"
          />
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center">
        Preprocessing: Grayscale conversion + 2x scale
      </div>
    </div>
  );
};

export default ImagePreview;