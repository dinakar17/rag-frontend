import { motion } from 'framer-motion';
import { ArrowRightCircle } from 'lucide-react';

const options = [
  { title: 'Make up a story', description: 'about Sharky, a tooth-brushing shark superhero', question: 'Can you tell me a story about Sharky?'},
  { title: 'Plan an itinerary', description: 'for a literary tour of England, visiting famous authors\'...', question: 'Can you help me plan a literary tour of England?'},
  { title: 'Create a recipe', description: 'for a delicious dish using only 5 ingredients', question: 'Can you give me a recipe for a 5-ingredient dish?'},
  { title: 'Write a poem', description: 'about the beauty of a sunrise', question: 'Can you write a poem about a sunrise?'},
  // ... other options
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function HomeDisplay({setUserQuestion}: {setUserQuestion: (question: string) => void}) {
 const handleClick = (question: string) => {
    setUserQuestion(question);
    }
  return (
    <motion.div 
      className="container mx-auto p-4 flex flex-col justify-end items-center"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="mb-10 text-center"
        variants={itemVariants}
      >
        <img src="/bajaj-motorcycle.svg" alt="Logo" className="h-12 mx-auto" />
        <h1 className="text-3xl text-slate-600 font-bold mt-4 dark:text-white">Hello Bro, How can I help you today?</h1>
      </motion.div>
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option, index) => (
            <motion.div key={index} 
              className="col-span-1 p-4 border rounded-lg hover:bg-gray-200 relative cursor-pointer dark:border-gray-700 dark:hover:bg-gray-600 dark:text-white"
              whileHover={{ scale: 1.05 }}
              variants={itemVariants}
              onClick={() => handleClick(option.question)}
              role="button"
              tabIndex={0}
            >
              <h2 className="text-xl font-semibold">{option.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{option.description}</p>
              <ArrowRightCircle className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100" size={24} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
