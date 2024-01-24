import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getResponsesSummaryFromUser } from '@/lib/actions';
import Link from 'next/link';

function Question({ question }: any) {
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
                <p className='text-sm font-medium text-muted-foreground'>
                  {answer.text}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Page({ params }: { params: { slug: string } }) {
  const result = await getResponsesSummaryFromUser(params.slug);

  return (
    <div className='mx-48 my-20'>
      <div className='my-10'>
        <Link href={`/forms`}>{'<-- Back to forms'}</Link>
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
