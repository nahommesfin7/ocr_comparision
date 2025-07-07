interface CompareButtonProps {
  bothOutputs: boolean;
  setBothOutputs: (value: boolean) => void;
}

export const CompareButton = ({ bothOutputs, setBothOutputs }: CompareButtonProps) => (
  <div className="flex justify-center space-x-4">
    <button
      onClick={() => setBothOutputs(!bothOutputs)}
      className={`px-4 py-2 rounded-lg ${
        bothOutputs
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Compare all
    </button>
  </div>
);