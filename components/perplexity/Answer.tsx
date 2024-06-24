import * as React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { MemoizedReactMarkdown } from '@/components/MarkdownRenderer';
// import { FadeIn } from '@/components/animations/FadeIn';
import { ResizablePanel } from '@/components/animations/ResizablePanel';
import { Icons } from '@/components/icons';
import { Sources } from '@/components/perplexity/Sources';
import { CodeBlock } from '@/components/ui/codeblock';
import { cn } from '@/lib/utils';

// Animation properties
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
};

export function AnswerCard({
  question,
  answer,
  isCurrentAnswer,
  status,
}: {
  question: string;
  answer: any;
  isCurrentAnswer: boolean;
  status: string;
}) {
  return (
    <div className="py-10">
      <div
        className={cn(
          'border-neutral-focus   rounded-xl border bg-neutral-100/50 p-4 shadow-md backdrop-blur ',
          'hover:border-accent-focus text-left transition',
          'dark:border-black/30 dark:bg-black/50',

          isCurrentAnswer
            ? 'border border-teal-200 ring-1 ring-inset transition duration-150 dark:border-teal-400/80 dark:ring-indigo-500/40 '
            : ''
        )}
      >
        <ResizablePanel content={answer.message}>
          <AnswerMessage
            isCurrentAnswer={isCurrentAnswer}
            content={answer.message}
            error={status === 'error'}
            submittedQ={question}
          />

          <AnimatePresence>
            {answer.sourceDocs ? <Sources sources={answer.sourceDocs} /> : null}
          </AnimatePresence>
        </ResizablePanel>
      </div>
    </div>
  );
}

export function AnswerMessage({
  submittedQ,
  // isCurrentAnswer,
  content,
  error,
}: {
  submittedQ: string;
  isCurrentAnswer: boolean;
  content: string;
  error: boolean;
}) {
  return (
    <>
      <AnimatedQuestion submittedQ={submittedQ} />
      <div className="w-full py-2">
        <div className="flex items-center">
          <Icons.arrowDR className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
          <p className="font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-600 dark:text-teal-400">
            BajajInfo
          </p>
        </div>
        <div className="w-full ">
          {error || !content ? (
            <LoadingLine />
          ) : (
            // <MarkdownRenderer
            //   isCurrent={isCurrentAnswer}
            //   content={content}
            //   className=" min-w-full"
            // />

            <div className="min-w-full pb-8">
              <MemoizedReactMarkdown
                className="prose min-w-full break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                  // @ts-expect-error - This is a valid component
                  p: ({ children }: { children: React.ReactNode }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  // @ts-expect-error - This is a valid component
                  code: ({
                    inline,
                    className,
                    children,
                    ...props
                  }: {
                    inline: boolean;
                    className: string;
                    children: React.ReactNode;
                    [key: string]: any; // Allow any other props
                  }) => {
                    if (Array.isArray(children) && children.length) {
                      if (children[0] === '▍') {
                        return <span className="mt-1 animate-pulse cursor-default">▍</span>;
                      }

                      children[0] = (children[0] as string).replace('`▍`', '▍');
                    }

                    const match = /language-(\w+)/.exec(className || '');

                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <CodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ''}
                        value={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    );
                  },
                }}
              >
                {content}
              </MemoizedReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AnimatedQuestion({ submittedQ }: { submittedQ: string }) {
  return (
    <AnimatePresence>
      {submittedQ && (
        <motion.h2
          key={submittedQ}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          className="mx-auto text-2xl font-bold tracking-tighter"
        >
          {submittedQ}
        </motion.h2>
      )}
    </AnimatePresence>
  );
}

function LoadingLine() {
  return (
    <div className="flex w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="flex-1">
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-300"></div>
              <div className="col-span-1 h-2 rounded bg-gray-300"></div>
            </div>
            <div className="h-2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
