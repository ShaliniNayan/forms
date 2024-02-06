import {
  createOption,
  deleteOption,
  deleteQuestion,
  getFormFromUser,
  getQuestionsFromUser,
  togglePublishFormFromUser,
  updateOptionText,
} from '@/lib/actions/actions';
import QuestionForm from './form';

import {
  createShortResponseQuestion,
  createOptionQuestion,
} from '@/lib/actions/questions/create';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const questions = await getQuestionsFromUser(params.slug);

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
        />
      }
    </>
  );
}
