import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFromUser, getQuestionsFromUser } from "@/lib/actions";
import Link from "next/link";


export default async function Page({ params }: { params: { slug: string } }) {

    const questions = await getQuestionsFromUser(params.slug);
    const form = await getFormFromUser(params.slug);

    const title = form?.title;

    return (
        <div className="mx-8 my-6 sm:mx-48 sm:my-8">
            <div className="my-10">
                <Link href={`/forms/${form?.id}`}>{"<-- Back to Editor"}</Link>
            </div>
            <div className="text-3xl font-semibold tracking-tight transition-colors">
                {title}
            </div>

            <div className="mt-12">
                {questions.map((element: any) => {
                    return (
                        <div key={element.id} className="mb-5 group relative">
                            <div className="sm:w-1/2 tracking-tight flex h-9 w-full rounded-md border-0 bg-transparent py-1 text-sm transition-colors leading-7 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                {element.text}
                            </div>
                            <Input placeholder={element.placeholder ? element.placeholder : ""} 
                            key={element.id + '1'}
                            className="sm:w-1/2 leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground"/>
                        </div>
                    )
                })}
            </div>
            <div className="mt-8">
                <Button>Submit</Button>
            </div>
        </div>
    )
}