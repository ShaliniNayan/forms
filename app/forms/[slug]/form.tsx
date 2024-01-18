'use client';

import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/components/ui/use-toast';
import {
  createQuestion,
  updateFormFromUser,
  updateQuestionFromUser,
} from '@/lib/actions';
import { useDebouncedCallback } from 'use-debounce';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 1 characters',
  }),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, {
          message: "Can't leave it as empty question",
        }),
        placeholder: z.string(),
      })
    )
    .optional(),
});

const QuestionForm = ({
  formId,
  questions,
  title,
  createQuestion,
  deleteQuestion,
  togglePublishFormFromUser,
  form,
}: {
  formId: string;
  questions: any;
  title: string;
  createQuestion: any;
  deleteQuestion: any;
  togglePublishFormFromUser: any;
  form: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  type FormSchema = z.infer<typeof formSchema>;
  const defaultValues: Partial<FormSchema> = {
    questions,
    title,
  };

  function onSubmit(data: FormSchema) {
    console.log('form submitted');
    toast({
      title: 'You submitted the form',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const debounced = useDebouncedCallback((questionId, placeholder, text) => {
    updateQuestionFromUser(formId, questionId, placeholder, text);
  }, 500);

  const formTitleDebounced = useDebouncedCallback(
    (formId: string, title: string) => {
      updateFormFromUser(formId, title);
    },
    500
  );

  return (
    <div className='mx-48 my-24'>
      <div className='my-10'>
        <Link href={`/forms`}>{'<-- Back to my forms'}</Link>
      </div>
      <Input
        defaultValue={title}
        placeholder='Type form title'
        className='border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'
        onChange={(e) => formTitleDebounced(formId, e.target.value)}
      />
      <div className='mt-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-2'
          onClick={async () => {
            await createQuestion(formId, questions.length);
          }}
        >
          Add question
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-2 ml-8'
          onClick={() => {
            router.push(`/forms/preview/${formId}`);
          }}
        >
          Preview
        </Button>
        <Button
          type='button'
          size='sm'
          className='mt-2 ml-2'
          onClick={async () => {
            await togglePublishFormFromUser(formId);
          }}
        >
          {form.published ? 'Unpublish' : 'Publish'}
        </Button>
        {form.published ? (
          <div>
            <Button
              type='button'
              size='sm'
              className='mt-8'
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://localhost:3000/forms/viewform/${formId}`
                );
                toast({
                  title: 'Link successfully copied',
                });
              }}
            >
              Copy Link
            </Button>
            <Button
              type='button'
              size='sm'
              variant='outline'
              className='mt-8 ml-2'
              onClick={async () => {
                router.push(`/forms/viewform/${formId}`);
              }}
            >
              Go to form
            </Button>
          </div>
        ) : null}
      </div>
      <div className='mt-12'>
        {questions.map((element: any) => {
          return (
            <div key={element.id} className='mb-5 group relative'>
              <Input
                defaultValue={element.text}
                key={element.id + '2'}
                placeholder='Type a question'
                className='w-1/2 border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 tracking-tight transition-colors leading-7 [&:not(:first-child)]:mt-0'
                onChange={(e) => debounced(element.id, null, e.target.value)}
              />
              <Input
                defaultValue={element.placeholder}
                placeholder='Type a placeholder for the response'
                key={element.id + '1'}
                className=' w-1/2 leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground'
                onChange={(e) => debounced(element.id, e.target.value, null)}
              />
              <div className='absolute top-2 left-0 transform-translate-x-full hidden group-hover:inline-flex'>
                <div className='mr-6'>
                  <div className='px-2 hover:cursor-pointer'>
                    <Plus
                      className='text-gray-700'
                      onClick={async () => {
                        await createQuestion(formId, element.order + 1);
                      }}
                    />
                  </div>
                  <div
                    className='px-2 mt-1 hover:cursor-pointer'
                    onClick={async () => {
                      await deleteQuestion(formId, element.id);
                    }}
                  >
                    <Trash2 className='mt-1 text-gray-700' />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionForm;
