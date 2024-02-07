'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { type Form, type Question, type Option, Prisma } from '@prisma/client';

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
  };
}>;

type ShortResponseAnswer = {
  type: 'SHORT_RESPONSE';
  optionId: null;
  text: string;
};

type ManyOptionsAnswer = {
  type: 'MANY_OPTIONS';
  optionId: string;
  text: string;
};

type Accumulator = {
  [key: string]: ShortResponseAnswer | ManyOptionsAnswer;
};

type SetAnswers = React.Dispatch<React.SetStateAction<Accumulator>>;

export default function Form({
  questions,
  submitForm,
  form,
}: {
  questions: QuestionWithOptions[];
  submitForm: any;
  form: Form;
}) {
  const route = useRouter();
  const [answers, setAnswers] = useState(
    questions.reduce((acc: any, question: any) => {
      if (question.type === 'SHORT_RESPONSE') {
        acc[question.id] = {
          type: 'SHORT_RESPONSE',
          optionId: null,
          text: null,
        };
      } else if (question.type === 'MANY_OPTIONS') {
        acc[question.id] = {
          type: 'MANY_OPTIONS',
          optionId: null,
          text: null,
        };
      }

      return acc;
    }, {})
  );

  return (
    <div>
      <div className='mt-16'>
        {questions.map((element: any) => {
          if (element.type === 'SHORT_RESPONSE') {
            return (
              <div key={element.id} className='mb-5 group relative'>
                <div className='sm:w-1/2 tracking-tight flex h-9 w-full rounded-md border-0 bg-transparent py-1 text-sm transition-colors leading-7 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
                  {element.text}
                </div>
                <Input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setAnswers((prevAnswers: any) => ({
                      ...prevAnswers,
                      [element.id]: {
                        ...prevAnswers[element.id],
                        text: newValue,
                      },
                    }));
                  }}
                  placeholder={element.placeholder ? element.placeholder : ''}
                  key={element.id + '1'}
                  className='sm:w-1/2 leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground'
                />
              </div>
            );
          } else if ('MANY_OPTIONS') {
            return (
              <div key={element.id} className='mb-5 group relative'>
                <div className='sm:w-1/2 tracking-tight flex h-9 w-full rounded-md border-0 bg-transparent py-1 text-sm transition-colors leading-7 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
                  {element.text}
                </div>
                <QuestionRadioGroup
                  setAnswers={setAnswers}
                  options={element.options}
                  questionId={element.id}
                />
              </div>
            );
          }
        })}
      </div>
      <div className='mt-8'>
        <Button
          onClick={async () => {
            await submitForm(answers, form.id);
            route.push(`/forms/success/${form.id}`);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

const QuestionRadioGroup = ({ options, setAnswers, questionId }: any) => {
  return (
    <RadioGroup
      onValueChange={(value) => {
        const newValue = value;
        setAnswers((prevAnswers: any) => ({
          ...prevAnswers,
          [questionId]: {
            ...prevAnswers[questionId],
            optionId: newValue,
          },
        }));
      }}
    >
      {options.map((option: any) => {
        return (
          <div
            key={option.id}
            className='flex items-center space-x-2 relative group'
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Input
              defaultValue={option.optionText}
              placeholder='type the option here'
              className='w-1/2 border-0 shadow-none  focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 tracking-tight transition-colors leading-7 [&:not(:first-child)]:mt-0'
            />
          </div>
        );
      })}
    </RadioGroup>
  );
};
