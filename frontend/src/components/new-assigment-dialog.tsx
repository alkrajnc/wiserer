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
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { DateTimePicker } from "./ui/date-time-picker";
import { Label } from "./ui/label";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { SubjectSelector } from "./subject-selector";

const NewAssigmentDialog = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                    <Plus />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[800px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>New Assigment</SheetTitle>
                    <SheetDescription>
                        Create a new assigment.
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-6">
                    <div className="">
                        <Label className="mb-2 px-1" htmlFor="title">
                            Title
                        </Label>
                        <Input id="title" placeholder="Assignment name" />
                    </div>
                    <div className="">
                        <Label className="mb-2 px-1" htmlFor="title">
                            Description
                        </Label>
                        <InputGroup>
                            <InputGroupTextarea
                                id="textarea-code-32"
                                placeholder="Brief assignment description"
                                className="min-h-[200px]"
                            />
                        </InputGroup>
                    </div>
                    <div className="flex flex-row gap-4">
                        <DateTimePicker label="Deadline" />
                        <div className="">
                            <Label className="mb-2 px-1">Subject</Label>
                            <SubjectSelector />
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit">Save</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
export default NewAssigmentDialog;
