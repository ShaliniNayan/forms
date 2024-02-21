import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getForm } from '@/lib/actions/actions';
import { RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default async function Page({ params }: { params: { slug: string } }) {
  const formId = params.slug;
  const form = await getForm(formId);

  const title = form.title;
  return (
    <div className='mx-4 mt-12 md:mx-32 xl:mx-96 xl:mt-24'>
      <h2 className='mb-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors'>
        {title}
      </h2>
      <Alert>
        <RocketIcon className='w-4 h-4' />
        <AlertTitle>Submission Successful</AlertTitle>
        <AlertDescription>
          Your form has successfully been submitted. Thank you for your time!
        </AlertDescription>
      </Alert>
      <div className='mt-4 md:mt-8'>
        <Link href={`/forms/viewform/${formId}`}>
          <Button className='px-0' variant='link'>
            {'Send another response'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
