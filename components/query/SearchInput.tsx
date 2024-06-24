import { AnimatePresence, motion } from 'framer-motion';

import { Icons } from '@/components/icons';
import { InputButton } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchProps = {
  value: string;
  status: string; // Define the possible values for status
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  placeholder: string;
  className?: string;
};

export function SearchInput({
  value,
  status,
  handleChange,
  handleClick,
  loading,
  placeholder,
  className,
}: SearchProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  }

  return (
    <div className="flex w-full max-w-lg items-center space-x-2">
      <InputButton
        className={cn('relative py-5 pr-10', className)}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={placeholder}
        enterKeyHint="go"
      >
        <div className="relative -ml-10 hidden items-center justify-center md:flex">
          <div className="absolute ml-4 w-14 rounded-r-full">
            <motion.button
              animate={status}
              initial={status}
              disabled={loading}
              type="submit"
              onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>)}
              className={cn(
                'bg-mauve-1 group z-10 inline-flex items-center justify-center rounded-full p-3 text-sm md:block',
                'text-mauve-12 ring-mauve-6 font-semibold shadow-sm ring-1 ring-inset',
                'hover:ring-mauve-7 hover:scale-105 hover:shadow hover:ring-inset hover:transition hover:duration-300',
                'focus:ring-mauve-8 focus:scale-105 focus:shadow focus:outline-none focus:ring-inset focus:transition focus:duration-300',
                'dark:ring-mauve-6 dark:hover:ring-mauve-8 dark:hover:shadow-[#1B1B25]'
              )}
            >
              <AnimatePresence>
                {loading ? (
                  <Icons.loadingSpinner className="-ml-0.5 h-7 w-7 animate-spin text-teal-500/80 group-hover:text-teal-500 dark:text-teal-400 dark:group-hover:text-teal-300" />
                ) : status === 'typing' || status === 'idle' ? (
                  <Icons.plus className="-ml-0.5 h-7 w-7" aria-hidden="true" />
                ) : (
                  <Icons.check className="-ml-0.5 h-7 w-7" />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </InputButton>
    </div>
  );
}
