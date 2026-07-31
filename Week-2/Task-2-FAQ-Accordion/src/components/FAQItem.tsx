type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: FAQItemProps) {
  return (
    <div className="border rounded-lg mb-4 overflow-hidden shadow-md bg-white">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-4 text-left font-semibold"
      >
        <span>{question}</span>
       <span className="text-xl text-red-600">
 {isOpen ? "−" : "+"}
</span>
      </button>

      {isOpen && (
        <div className="p-4 border-t bg-gray-100">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default FAQItem;