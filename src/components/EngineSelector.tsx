interface EngineSelectorProps {
  ocrEngine: 'mistral' | 'tesseract' | 'gemini-2.5' | 'gemini-1.5';
  setOcrEngine: (engine: 'mistral' | 'tesseract' | 'gemini-2.5' | 'gemini-1.5') => void;
}

export const EngineSelector = ({ ocrEngine, setOcrEngine }: EngineSelectorProps) => (
  <div className="flex justify-center space-x-4">
    {[
      { id: 'mistral', label: 'Mistral OCR' },
      { id: 'tesseract', label: 'Tesseract OCR' },
      { id: 'gemini-2.5', label: 'Gemini 2.5' },
      { id: 'gemini-1.5', label: 'Gemini 1.5' },
    ].map(({ id, label }) => (
      <button
        key={id}
        onClick={() => setOcrEngine(id as typeof ocrEngine)}
        className={`px-4 py-2 rounded-lg ${
          ocrEngine === id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);