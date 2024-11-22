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

import Date from "@/app/(components)/Date"

export default function Home() {
  return (
      <>
          <Header/>
          <div className="flex items-center justify-center">
              <Date/>
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
