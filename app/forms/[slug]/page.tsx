import {
  deleteQuestion,
  getFormFromUser,
  getQuestionsFromUser,
  togglePublishFormFromUser,
  updateOptionText,
} from '@/lib/actions/actions';

import { headers } from 'next/headers';
import QuestionForm from './form';

import {
  createShortResponseQuestion,
  createOptionQuestion,
  createMultipleOptionQuestion,
} from '@/lib/actions/questions/create';
import { notFound } from 'next/navigation';
import { createOption } from '@/lib/actions/options/create';
import { deleteOption } from '@/lib/actions/options/delete';

export default async function Page({ params }: { params: { slug: string } }) {
  const questions = await getQuestionsFromUser(params.slug);

  const headersList = headers();

  const host = headersList.get('host') || '';

  if ('error' in questions) {
    notFound();
  }
  const form = await getFormFromUser(params.slug);

  if (form === null || 'error' in form) {
    notFound();
  }
  return (
    <>
      {
        <QuestionForm
          questions={questions}
          formId={params.slug}
          createShortResponseQuestion={createShortResponseQuestion}
          deleteQuestion={deleteQuestion}
          togglePublishFormFromUser={togglePublishFormFromUser}
          form={form}
          createOptionQuestion={createOptionQuestion}
          updateOptionText={updateOptionText}
          createOption={createOption}
          deleteOption={deleteOption}
          host={host}
          createMultipleOptionQuestion={createOptionQuestion}
        />
      }
    </>
  );
}
