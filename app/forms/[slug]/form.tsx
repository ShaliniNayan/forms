'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Form({
  questions,
  submitForm,
  form,
}: {
  questions: any;
  submitForm: any;
  form: any;
}) {
  const route = useRouter();
  const [answers, setAnswers] = useState(
    questions.reduce((acc: any, question: any) => {
      acc[question.id] = '';
      return acc;
    }, {})
  );

  return (
    <div>
      <div className='mt-12'>
        {questions.map((element: any) => {
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
                    [element.id]: newValue,
                  }));
                }}
                placeholder={element.placeholder ? element.placeholder : ''}
                key={element.id + '1'}
                className='sm:w-1/2 leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground'
              />
            </div>
          );
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
