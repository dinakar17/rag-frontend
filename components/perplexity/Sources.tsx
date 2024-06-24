import * as React from 'react';

import { motion } from 'framer-motion';

import { FadeIn } from '@/components/animations/FadeIn';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToggle } from '@/hooks/use-toggle';
import { cn, pluralize, truncateLongFileName, truncateLongUrl } from '@/lib/utils';

const animateList = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 1.1,
      staggerChildren: 0.2,
    },
  },
};

const animateItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function Sources({ sources }: { sources: any }) {
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <div className="my-2 border-t border-neutral-400/30 pb-4">
      <Collapsible open={isOpen} onOpenChange={toggleIsOpen} className="space-y-2">
        <div className="flex justify-between">
          <Header sources={sources} />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 w-9 p-0">
              <Icons.list className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <PillList sources={sources} />
        <FadeIn>
          <ContentList sources={sources} isOpen={isOpen} />
        </FadeIn>
      </Collapsible>
    </div>
  );
}

function Header({ sources }: { sources: any }) {
  const sourceCount = `${sources.length} ${pluralize('SOURCE', sources.length)}`;

  return (
    <div className="flex items-center justify-between space-x-4 pr-4">
      <div className="flex gap-2">
        <Icons.link className="h-4 w-4  stroke-indigo-600 dark:stroke-teal-400" />
        <p className="font-aboreto text-sm font-bold leading-tight tracking-wide text-indigo-600 dark:text-teal-400">
          {sourceCount}
        </p>
      </div>
    </div>
  );
}

function PillList({ sources }: { sources: any }) {
  return (
    <motion.ul
      variants={animateList}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 after:mb-2"
    >
      {sources.map((source: any, i: number) => (
        <PillListItem key={`${source.metadata.type}-${i}`} order={i} source={source} />
      ))}
    </motion.ul>
  );
}

function PillListItem({ order, source }: { order: number; source: any }) {
  const srcLength = 15;
  const formattedSource =
    source.metadata.type === 'scrape'
      ? truncateLongUrl(source.metadata.source, srcLength)
      : truncateLongFileName(source.metadata.source, srcLength);

  if (source.metadata.type === 'scrape') {
    return (
      <motion.li
        variants={animateItem}
        className=" group block max-w-lg cursor-pointer rounded-full "
      >
        <motion.a
          href={source.metadata.source}
          target="_blank"
          rel="noopener noreferrer"
          className="group-hover:border-violet-10 group flex items-center gap-x-1 divide-x divide-neutral-500/70 rounded-full border border-neutral-700/50 bg-transparent p-1 transition  duration-300 dark:border-neutral-400/50 md:gap-x-2 md:p-2"
        >
          <Pill order={order} source={formattedSource} />
        </motion.a>
      </motion.li>
    );
  }

  return (
    <motion.li variants={animateItem} className="group block max-w-lg cursor-default rounded-full ">
      <motion.div className="group-hover:border-violet-10 group flex items-center gap-x-1 divide-x divide-neutral-500/70 rounded-full border border-neutral-700/50 bg-transparent p-1 transition  duration-300 dark:border-neutral-400/50 md:gap-x-2 md:p-2">
        <Pill order={order} source={formattedSource} />
      </motion.div>
    </motion.li>
  );
}

function Pill({ order, source }: { order: number; source: string }) {
  return (
    <>
      <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-1.5 transition duration-300 md:pl-2 ">
        <div className=" selection:bg-teal-8 group-hover:text-teal-9 font-aboreto text-xs font-bold uppercase leading-none tracking-widest text-neutral-600 transition duration-300 selection:text-white dark:text-neutral-400 dark:group-hover:text-teal-500 ">
          {order + 1}
        </div>
      </div>
      <div className="px-1 md:px-3">
        <div className="divide-mauve-1 border-mauve-6  flex items-center bg-transparent transition duration-300 ">
          <div className="text-mauve-12 selection:bg-teal-8 group-hover:text-teal-9 dark:group-hover:text-teal-10 font-sans text-sm transition-all duration-300 selection:text-white ">
            {source}
          </div>
        </div>
      </div>
    </>
  );
}

function ContentList({ sources, isOpen }: { sources: any; isOpen: boolean }) {
  return (
    <CollapsibleContent className="pt-3">
      <ul className="my-2 flex flex-col gap-3">
        <FadeIn>
          {sources.map((source: any, i: number) => (
            <li key={`document-${i}`} className="max-w-[750px]">
              <Content
                key={`document-${i}`}
                order={i}
                isOpen={isOpen}
                sourceContent={source.pageContent}
              />
            </li>
          ))}
        </FadeIn>
      </ul>
    </CollapsibleContent>
  );
}

function Content({
  order,
  sourceContent,
  isOpen,
}: {
  order: number;
  sourceContent: string;
  isOpen: boolean;
}) {
  return (
    <div className=" group mb-4 block  cursor-pointer ">
      <div className="group-hover:border-pink-10 group flex items-center gap-x-2  rounded-xl  bg-transparent transition duration-300">
        <div className=" bg-transparent pr-2 transition duration-300 ">
          <div className=" text-mauve-11 selection:bg-teal-8 group-hover:text-teal-9 dark:group-hover:text-teal-10 font-aboreto text-xs font-bold uppercase leading-none tracking-widest transition duration-300 selection:text-white ">
            {order + 1}
          </div>
        </div>
        <div className="mb-2 mr-2">
          <div className="flex items-center gap-x-1 bg-transparent transition duration-300 ">
            {isOpen ? <AnimatedParagraph content={sourceContent} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedParagraph({ content }: { content: string }) {
  const [isClamped, toggleIsClamped] = useToggle();

  if (content) {
    return (
      <p
        key={content}
        onClick={toggleIsClamped}
        className={cn(
          '  text-mauve-12 selection:bg-teal-8 group-hover:text-violet-9 dark:group-hover:text-violet-11 max-w-2xl font-sans text-sm transition-all duration-300 selection:text-white md:max-w-full  ',
          isClamped ? '' : 'line-clamp-5'
        )}
      >
        {content}
      </p>
    );
  }
  return null;
}
