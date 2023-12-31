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
import { toast } from '@/components/ui/use-toast';
import { createQuestion, updateQuestionFromUser } from '@/lib/actions';
import { useDebouncedCallback } from 'use-debounce';

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
}: {
  formId: string;
  questions: any;
  title: string;
  createQuestion: any;
}) => {
  type FormSchema = z.infer<typeof formSchema>;
  const defaultValues: Partial<FormSchema> = {
    questions,
    title,
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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
  }, 1000);

  const { fields, append } = useFieldArray({
    name: 'questions',
    control: form.control,
  });

  return (
    <div className='mx-48 my-24'>
      <Input
        placeholder='Type form title'
        className='border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'
      />
      <div className='mt-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-2'
          onClick={async () => {
            await createQuestion(formId);
          }}
        >
          Add question
        </Button>
      </div>
      <div className='mt-12'>
        {questions.map((element: any) => {
          return <div key={element.id} className='mb-5'>            
              <Input
                defaultValue={element.text}
                key={element.id + '2'}
                placeholder='Type a question'
                className='border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 tracking-tight transition-colors leading-7 [&:not(:first-child)]:mt-0'
                onChange={(e) => {
                  debounced(element.id, null, e.target.value);
                }}
              />
              <Input
                defaultValue={element.placeholder}
                placeholder='Type a placeholder for the response'
                key={element.id + '1'}
                className='leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground'
                onChange={(e) => {
                  debounced(element.id, e.target.value, null);
                }}
              />
          </div>;
        })}
      </div>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-1/3 space-y-8'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='!space-y-0'>
                <FormControl>
                  <Input
                    placeholder='Type form title'
                    className='border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={async () => {
              await createQuestion(formId);
              append({
                text: '',
                placeholder: '',
              });
            }}
          >
            Add question
          </Button>
          {fields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={form.control}
                key={field.id + '0'}
                name={`questions.${index}.text`}
                render={({ field }) => (
                  <FormItem className='!space-y-0'>
                    <FormControl>
                      <Input
                        placeholder='Type a question'
                        className='border-0 shadow-none focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 tracking-tight transition-colors first:mt-0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={field.id + '1'}
                name={`questions.${index}.placeholder`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Type placeholder text'
                        className='leading-7 text-muted-foreground [&:not(:first-child)]:mt-6'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button type='submit'>Submit</Button>
        </form>
      </Form> */}
    </div>
  );
};

export default QuestionForm;
