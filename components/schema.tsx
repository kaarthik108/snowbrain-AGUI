import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DDLData } from "@/lib/utils/ddl";
import { Code } from "bright";

function DDLRenderer({ ddl }: { ddl: string }) {
  return (
    <div className="py-4 whitespace-pre-line text-sm">
      <Code
        lang="sql"
        className="text-xs sm:text-sm max-w-[380px] sm:max-w-[480px] overflow-auto"
      >
        {ddl}
      </Code>
    </div>
  );
}

export function Schema() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-xs sm:text-sm ml-2 sm:ml-0">
          Schema
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-auto">
        <SheetHeader>
          <SheetTitle>Database Schema</SheetTitle>
          <SheetDescription>
            View the DDL statements for the database tables.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-3 mt-2">
          {DDLData.map((table) => (
            <div key={table.tableName}>
              <h3 className="text-stone-400">{table.tableName}</h3>
              <DDLRenderer ddl={table.ddl} />
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" variant={"outline"}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
