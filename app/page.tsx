import Header from '@/components/header.component';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <div>
      <section className=''>
        <div className='ml-24'>
          <h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]'>
            Build beautiful Forms
          </h1>
          <h1 className='mt-2 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]'>
            And own your Data
          </h1>
        </div>
        <div className='mt-8 ml-24'>
          <div className='max-w-[750px] text-lg text-muted-foreground sm:text-xl'>
            Publish your form in very quick span of time.
          </div>
        </div>
        <div className='flex w-full items-center space-x-4 pb-8'>
          <Link href={"/register"}>
            <Button>Create Form</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
