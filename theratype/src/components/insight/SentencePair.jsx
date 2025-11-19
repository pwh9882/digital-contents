import Card from '../common/Card';

const SentencePair = ({ pairData, onSelect, selectedChoice }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold tracking-wide uppercase">
          {pairData.categoryName}
        </span>
        <h2 className="text-2xl font-bold text-neutral-800 mt-4">
          어느 문장이 더 마음에 와닿나요?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Option A (Left) */}
        <div className="relative group">
          <Card
            variant={selectedChoice === 'A' ? 'outlined' : 'elevated'}
            onClick={() => onSelect('A')}
            className={`h-full flex flex-col justify-center items-center p-8 cursor-pointer transition-all duration-300 transform ${selectedChoice === 'A'
                ? 'border-primary-500 border-2 ring-4 ring-primary-100 shadow-xl scale-[1.02]'
                : 'hover:shadow-xl hover:-translate-y-1 border-transparent border-2'
              }`}
          >
            <div className="text-center">
              <div className="text-xl font-medium text-neutral-800 leading-relaxed">
                {pairData.pairA.text}
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-neutral-400 transition-opacity duration-300 ${selectedChoice ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
              }`}>
              <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">← Left</span>
            </div>
          </Card>
        </div>

        {/* Option B (Right) */}
        <div className="relative group">
          <Card
            variant={selectedChoice === 'B' ? 'outlined' : 'elevated'}
            onClick={() => onSelect('B')}
            className={`h-full flex flex-col justify-center items-center p-8 cursor-pointer transition-all duration-300 transform ${selectedChoice === 'B'
                ? 'border-primary-500 border-2 ring-4 ring-primary-100 shadow-xl scale-[1.02]'
                : 'hover:shadow-xl hover:-translate-y-1 border-transparent border-2'
              }`}
          >
            <div className="text-center">
              <div className="text-xl font-medium text-neutral-800 leading-relaxed">
                {pairData.pairB.text}
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-neutral-400 transition-opacity duration-300 ${selectedChoice ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
              }`}>
              <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">Right →</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentencePair;
