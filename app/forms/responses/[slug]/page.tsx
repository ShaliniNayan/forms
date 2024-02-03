import ResponsePie from '@/components/pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getResponsesSummaryFromUser } from '@/lib/actions';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

function Question({ question }: any) {
  if (question.type === 'SHORT_RESPONSE') {
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader>
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
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
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader>
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            <ResponsePie />
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
    <div className='mx-48 my-20'>
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
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
        Responses
      </h2>
      {result.map((question: any) => {
        return <Question question={question} key={question.id} />;
      })}
    </div>
  );
}
