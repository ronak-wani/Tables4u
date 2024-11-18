import React from 'react';
import Header from "@/app/(components)/Header";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export default function Home() {
  return (
      <>
          <Header/>
          <div className="flex items-center justify-center">
              <Command>
                  <CommandInput placeholder="Find restaurants ..."/>
                  <div className={`invisible`}>
                      <CommandList>

                      </CommandList>
                  </div>
              </Command>
          </div>

      </>
  );
}
