interface ResultsDisplayProps {
  bothOutputs: boolean;
  mistralText: string;
  tesseractText: string;
  gemini25Text: string;
  gemini15Text: string;
  text: string;
  ocrEngine: 'mistral' | 'tesseract' | 'gemini-2.5' | 'gemini-1.5';
}

const ResultsDisplay = ({
  bothOutputs,
  mistralText,
  tesseractText,
  gemini25Text,
  gemini15Text,
  text,
  ocrEngine,
}: ResultsDisplayProps) => {
  if (bothOutputs) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: 'Mistral Output:', content: mistralText },
          { title: 'Tesseract Output:', content: tesseractText },
          { title: 'Gemini 2.5 Output:', content: gemini25Text },
          { title: 'Gemini 1.5 Output:', content: gemini15Text },
        ].map(({ title, content }) => (
          <div key={title} className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
            <div className="bg-white rounded-lg p-4 shadow-inner">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {content || 'No text extracted'}
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        {ocrEngine.charAt(0).toUpperCase() + ocrEngine.slice(1)} Output:
      </h4>
      <div className="bg-white rounded-lg p-4 shadow-inner">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {text}
        </pre>
      </div>
    </div>
  );
};

export default ResultsDisplay;