import { useState } from 'react';
import Card from '../common/Card';

const SentencePair = ({ pairData, onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (choice) => {
    setSelected(choice);
    onSelect(choice === 'A' ? pairData.pairA : pairData.pairB);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {pairData.categoryName}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card
          variant={selected === 'A' ? 'outlined' : 'elevated'}
          onClick={() => handleSelect('A')}
          className={`transition-all ${
            selected === 'A'
              ? 'border-primary-500 border-4 shadow-lg'
              : 'hover:shadow-xl'
          }`}
        >
          <div className="text-center">
            <div className="text-lg text-neutral-800 leading-relaxed">
              {pairData.pairA.text}
            </div>
          </div>
        </Card>

        <Card
          variant={selected === 'B' ? 'outlined' : 'elevated'}
          onClick={() => handleSelect('B')}
          className={`transition-all ${
            selected === 'B'
              ? 'border-primary-500 border-4 shadow-lg'
              : 'hover:shadow-xl'
          }`}
        >
          <div className="text-center">
            <div className="text-lg text-neutral-800 leading-relaxed">
              {pairData.pairB.text}
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center text-sm text-neutral-500 mt-4">
        더 공감되는 문장을 선택하세요
      </div>
    </div>
  );
};

export default SentencePair;
