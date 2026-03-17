import { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { PixiFlicker } from './PixiFlicker';

interface Option {
  text: string;
  frequency: number;
}

function App() {
  const [numOptions, setNumOptions] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionText, setQuestionText] = useState('Question');
  const [options, setOptions] = useState<Option[]>([
    { text: 'Option 1', frequency: 2 },
    { text: 'Option 2', frequency: 4 },
    { text: 'Option 3', frequency: 6 },
    { text: 'Option 4', frequency: 8 },
    { text: 'Option 5', frequency: 10 },
    { text: 'Option 6', frequency: 12 },
  ]);

  const availableFrequencies = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60];

  const handleFrequencyChange = (index: number, value: number) => {
    const newOptions = [...options];
    newOptions[index].frequency = value;
    setOptions(newOptions);
  };

  const handleTextChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div className="w-48 bg-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">Menu</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsPlaying(true)}
            className={`p-2 rounded hover:bg-gray-100 ${isPlaying ? 'bg-gray-200' : ''}`}
            disabled={isPlaying}
          >
            <Play className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            className={`p-2 rounded hover:bg-gray-100 ${!isPlaying ? 'bg-gray-200' : ''}`}
            disabled={!isPlaying}
          >
            <Square className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Number of Options</label>
          <input
            type="range"
            min="2"
            max="6"
            value={numOptions}
            onChange={(e) => setNumOptions(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm mt-1">{numOptions}</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-sm font-bold mb-2">Question</h2>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              placeholder="Enter question text"
            />
          </div>

          <h2 className="text-sm font-bold mb-3">Options</h2>
          {Array.from({ length: numOptions }, (_, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-gray-200">
              <div className="text-xs font-medium mb-1">Option {i + 1} Text</div>
              <input
                type="text"
                value={options[i]?.text || ''}
                onChange={(e) => handleTextChange(i, e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1 mb-2"
                placeholder={`Option ${i + 1}`}
              />
              <div className="text-xs text-gray-600 mb-1">Frequency (Hz)</div>
              <select
                value={options[i]?.frequency || 2}
                onChange={(e) => handleFrequencyChange(i, parseInt(e.target.value))}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
              >
                {availableFrequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <PixiFlicker
        options={options}
        numOptions={numOptions}
        isPlaying={isPlaying}
        questionText={questionText}
      />
    </div>
  );
}

export default App;
