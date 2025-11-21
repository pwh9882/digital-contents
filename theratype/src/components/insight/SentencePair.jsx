import Card from '../common/Card';

const SentencePair = ({ pairData, onSelect, selectedChoice }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium tracking-wide uppercase mb-4">
          {pairData.categoryName}
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text-main">
          Which resonates with you more?
        </h2>
        <p className="text-text-muted mt-2">
          Select the sentence that best reflects your current state.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {/* Option A (Left) */}
        <div
          className={`relative group transition-all duration-500 ${selectedChoice === 'B' ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100'
            }`}
        >
          <Card
            variant={selectedChoice === 'A' ? 'elevated' : 'outlined'}
            onClick={() => onSelect('A')}
            className={`h-64 md:h-80 flex flex-col justify-center items-center p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedChoice === 'A'
              ? 'ring-4 ring-primary-100 border-primary-500 shadow-glow'
              : 'hover:border-primary-300 hover:shadow-lg'
              }`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-primary-500 transition-transform duration-300 ${selectedChoice === 'A' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />

            <div className="text-center z-10">
              <div className="text-xl md:text-2xl font-medium text-text-main leading-relaxed font-display">
                "{pairData.pairA.text}"
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Press <kbd className="mx-1 px-2 py-1 bg-bg-highlight rounded border border-border-base font-mono text-text-muted">←</kbd> or <kbd className="mx-1 px-2 py-1 bg-bg-highlight rounded border border-border-base font-mono text-text-muted">1</kbd>
            </div>
          </Card>
        </div>

        {/* Option B (Right) */}
        <div
          className={`relative group transition-all duration-500 ${selectedChoice === 'A' ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100'
            }`}
        >
          <Card
            variant={selectedChoice === 'B' ? 'elevated' : 'outlined'}
            onClick={() => onSelect('B')}
            className={`h-64 md:h-80 flex flex-col justify-center items-center p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedChoice === 'B'
              ? 'ring-4 ring-secondary-100 border-secondary-500 shadow-glow'
              : 'hover:border-secondary-300 hover:shadow-lg'
              }`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-secondary-500 transition-transform duration-300 ${selectedChoice === 'B' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />

            <div className="text-center z-10">
              <div className="text-xl md:text-2xl font-medium text-text-main leading-relaxed font-display">
                "{pairData.pairB.text}"
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Press <kbd className="mx-1 px-2 py-1 bg-bg-highlight rounded border border-border-base font-mono text-text-muted">→</kbd> or <kbd className="mx-1 px-2 py-1 bg-bg-highlight rounded border border-border-base font-mono text-text-muted">2</kbd>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentencePair;
