import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';

export default function Page() {
  return (
    <div className='my-28 mx-28'>
      <Alert>
        <RocketIcon className='w-4 h-4' />
        <AlertTitle>Submission Successful</AlertTitle>
        <AlertDescription>
          Your form has successfully been submitted. Thank you for your time!
        </AlertDescription>
      </Alert>
    </div>
  );
}
