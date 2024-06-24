import React, { useLayoutEffect, useRef, useState } from 'react';

import { applyPatch } from '@langchain/core/utils/json_patch';
import { LayoutGroup, motion } from 'framer-motion';
import { Document } from 'langchain/document';
import { RemoteRunnable } from 'langchain/runnables/remote';
import { v4 as uuidv4 } from 'uuid';

import { AnswerCard } from '@/components/perplexity/Answer';
import { SearchInput } from '@/components/query/SearchInput';
import { usePineconeQuery } from '@/hooks/use-query';
import { cn } from '@/lib/utils';
import { Message } from '@/types';

import HomeDisplay from '../HomeDisplay';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function DocumentQA({ namespace }: { namespace: string }) {
  const { status, setStatus, userQuestion, setUserQuestion } = usePineconeQuery(namespace);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [chatHistory, setChatHistory] = useState<{ human: string; ai: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus('typing');
    return setUserQuestion(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userQuestion === '') {
      alert('Please enter a question');
      return;
    }

    setStatus('loading');

    const question = userQuestion.trim();

    // add the user question to the messages
    setMessages((prevMessages) => [...prevMessages, { type: 'userMessage', message: question }]);

    setUserQuestion('');

    let sources: Document[] = [];
    let accumulatedMessage = '';
    let messageIndex: number | null = null;

    try {
      const sourceStepName = 'FindDocs';
      const llmDisplayName = 'openai_gpt_3_5_turbo';
      let streamedResponse: Record<string, any> = {};

      const remoteChain = new RemoteRunnable({
        url: `${BACKEND_URL}/chat`,
        options: {
          timeout: 60000,
        },
      });

      const streamLog = await remoteChain.streamLog(
        {
          question: userQuestion,
          chat_history: chatHistory,
        },
        {
          configurable: {
            llm: llmDisplayName,
          },
          tags: [`model:${llmDisplayName}`],
          metadata: {
            conversation_id: uuidv4(),
            llm: llmDisplayName,
          },
        },
        {
          includeNames: [sourceStepName],
        }
      );

      setStatus('streaming');
      // load the streamed response
      for await (const chunk of streamLog) {
        streamedResponse = applyPatch(streamedResponse, chunk.ops).newDocument;
        console.log(streamedResponse);
        if (Array.isArray(streamedResponse?.logs?.[sourceStepName]?.final_output?.output)) {
          sources = streamedResponse.logs[sourceStepName].final_output.output;
        }
        if (Array.isArray(streamedResponse?.streamed_output)) {
          // join only the even indexed strings
          accumulatedMessage = streamedResponse.streamed_output
            .filter((_, i) => i % 2 === 0)
            .join('');
        }
        // if (streamedResponse.id !== undefined) {
        //   runId = streamedResponse.id;
        // }
        // const parsedResult = marked.parse(accumulatedMessage);

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (messageIndex === null || newMessages[messageIndex] === undefined) {
            messageIndex = newMessages.length;
            newMessages.push({
              type: 'apiMessage',
              message: accumulatedMessage,
              sourceDocs: sources,
              question: userQuestion,
            });
          } else if (newMessages[messageIndex] !== undefined) {
            newMessages[messageIndex].message = accumulatedMessage;
            newMessages[messageIndex].sourceDocs = sources;
          }
          return newMessages;
        });
      }

      // After the stream is done, we can set the status to complete
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { human: userQuestion, ai: accumulatedMessage },
      ]);
      setStatus('complete');
    } catch (e) {
      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setUserQuestion(userQuestion);
      setStatus('error');
      throw e;
    }
    // return generateAnswer(e);
  };

  function scrollToBottom() {
    return messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const aiAnswer = messages.filter((message) => message.type === 'apiMessage');

  const userQuestions = messages.filter((message) => message.type !== 'apiMessage');

  const last = aiAnswer[aiAnswer.length - 1];

  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === 'complete' && last?.sourceDocs && last?.sourceDocs?.length >= 1) {
      timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 500); // Adjust the timeout duration as needed

      return () => clearTimeout(timeoutId);
    }
  }, [status, last?.sourceDocs]);

  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === 'streaming') {
      timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 200); // Adjust the timeout duration as needed
      scrollToBottom();
    }
    return () => clearTimeout(timeoutId);
  }, [status]);

  return (
    <section className=" container mx-1 pb-8 md:pb-10">
      <div className={cn(' mb-6 flex flex-col items-center justify-center pb-20')}>
        <div className="w-full max-w-4xl">
          <LayoutGroup>
            {/* If the aiAnswer array is empty then display Homedisplay */}
            {!aiAnswer.length && <HomeDisplay setUserQuestion={setUserQuestion} />}
            {aiAnswer
              ? aiAnswer.map((answer, i) => {
                  const isCurrentAnswer = aiAnswer.length - 1 === i;
                  // console.log(userQuestions[i])
                  return (
                    <AnswerCard
                      key={`${answer.question}-container-${i}`}
                      answer={answer}
                      question={userQuestions[i].message}
                      isCurrentAnswer={isCurrentAnswer}
                      status={status}
                    />
                  );
                })
              : null}
          </LayoutGroup>
        </div>
        <div className={cn('min-w-screen fixed bottom-[20px] md:min-w-[850px]')}>
          <motion.div
            layout
            className="flex w-full max-w-4xl flex-col items-center justify-center "
          >
            <SearchInput
              status={status}
              value={userQuestion}
              handleClick={handleSubmit}
              handleChange={handleChange}
              loading={status === 'loading' || status === 'streaming'}
              placeholder="Enter the question you have in mind..."
            />
          </motion.div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </section>
  );
}

export default DocumentQA;
