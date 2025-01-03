import { memo, useState } from 'react';


const Quiz = memo(({ question, options, correctAnswer }: { question: string; options: string[]; correctAnswer: string }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        setShowAnswer(true);
    };

    const isCorrect = showAnswer && selectedAnswer === correctAnswer;

    return (
        <div className="my-6 p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">{question}</h2>
            <ul className="space-y-2">
                {options.map((option, index) => (
                    <li key={index}>
                        <button
                            className={`w-full text-left p-3 border rounded transition-colors duration-200 ease-in-out
                              ${selectedAnswer === option ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 'border-gray-300 hover:bg-gray-100'}
                              ${showAnswer && selectedAnswer !== option && option === correctAnswer ? 'bg-green-100 border-green-500' : ''}
                            `}
                            onClick={() => handleAnswer(option)}
                            disabled={showAnswer}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
           {!showAnswer && <button
                className="w-full mt-4 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
                onClick={handleSubmit}
            >
                Submit
            </button>}

            {showAnswer && (
                <div className="mt-4 p-3 rounded  font-semibold">
                    {isCorrect ? (
                        <div className="text-green-600 bg-green-100 rounded p-2">Correct!</div>
                    ) : (
                        <div className="text-red-600 bg-red-100 rounded p-2">
                            Wrong! The correct answer is <span className="font-bold">{correctAnswer}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});


Quiz.displayName = 'Quiz';

export { Quiz };