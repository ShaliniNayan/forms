import { useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { CheckCircledIcon, PauseIcon } from '@radix-ui/react-icons';

export function QuestionCommand({
  open,
  setOpen,
  newElementOrder,
  formId,
  createShortResponseQuestion,
  createOptionQuestion,
}: any) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open: any) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  return (
    <div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup heading='Options'>
            <CommandItem
              className='cursor-pointer'
              onSelect={async () => {
                await createShortResponseQuestion(formId, newElementOrder);
                setOpen(false);
              }}
            >
              <PauseIcon className='mr-2 h-4 w-4 rotate-90' />
              <span>Add short text question</span>
            </CommandItem>
            <CommandItem
              className='cursor-pointer'
              onSelect={async () => {
                await createOptionQuestion(formId, newElementOrder);
                setOpen(false);
              }}
            >
              <CheckCircledIcon className='mr-2 h-4 w-4' />
              <span>Add multiple options question</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
