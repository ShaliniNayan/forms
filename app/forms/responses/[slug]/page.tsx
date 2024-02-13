import ResponsePie from '@/components/pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getResponsesSummaryFromUser } from '@/lib/actions/actions';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

import { notFound } from 'next/navigation';

import { type Form, type Question, Prisma, type Option } from '@prisma/client';

type QuestionWithOptionsWithAnswer = Prisma.QuestionGetPayload<{
  include: {
    answers: {
      include: {
        option: true;
      };
    };
  };
}>;

function transformData(optionsData: (Option | null)[]) {
  type QuestionIdCount = {
    [key: string]: {
      name: string;
      value: number;
    };
  };
  const questionIdCount: QuestionIdCount = {};

  optionsData.forEach((item: any) => {
    if (item === null) {
      return;
    }
    if (!questionIdCount[item.id]) {
      questionIdCount[item.id] = { name: item.optionText, value: 1 };
    } else {
      questionIdCount[item.id].value += 1;
    }
  });

  const result = Object.values(questionIdCount);

  return result;
}

function Question({ question }: any) {
  if (question.type === 'SHORT_RESPONSE') {
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader className='md:space-y-2 space-y-2'>
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {question.answers.map((answer: any) => {
              return (
                <div key={answer.key} className='ml-4 space-y-1'>
                  <p className='text-sm font-medium text-muted-background'>
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else if (question.type === 'MANY_OPTIONS') {
    const options = transformData(
      question.answers.map((answer: any) => {
        return answer.option;
      })
    ) as any[];
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader className='pb-2'>
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            <ResponsePie data={options} />
            {question.answers.map((answer: any) => {
              return (
                <div key={answer.key} className='ml-4 space-y-1'>
                  <p className='text-sm font-medium text-muted-background'>
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const result = await getResponsesSummaryFromUser(params.slug);

  return (
    <div className='md:first-letter:mx-48 md:my-20 px-4 mb-4'>
      <div className='my-10'>
        <Link href={`/forms`}>
          <div className='flex items-center'>
            {
              <MoveLeft
                className='mr-2'
                color='#000000'
                strokeWidth={1.75}
                absoluteStrokeWidth
                size={18}
              />
            }
            {'Back to my forms'}
          </div>
        </Link>
      </div>
      <h2 className='border-b pb-2 text-3xl font-semibold tracking-tight transition-colors'>
        Responses
      </h2>
      {result.map((question: any) => {
        return <Question question={question} key={question.id} />;
      })}
    </div>
  );
}
