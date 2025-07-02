const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2 py-4">
    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600 delay-75"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600 delay-150"></div>
    <span className="text-gray-600 ml-2">Processing image...</span>
  </div>
);
export default LoadingSpinner;