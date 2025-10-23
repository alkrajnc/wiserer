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

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { SubjectSelector } from "./subject-selector";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Assignment name must be at least 4 characters.")
        .max(32, "Assignment name must be at most 48 characters."),
    description: z
        .string().optional,
});

const NewAssigmentDialog = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
    };

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
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="">
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Assignment Title
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState
                                                    .invalid}
                                                placeholder="Some title..."
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <div className="">
                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="form-description">
                                                Description
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="form-description"
                                                    placeholder="I need to do this, this, that"
                                                    rows={6}
                                                    className="min-h-24 resize-none"
                                                    aria-invalid={fieldState
                                                        .invalid}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums">
                                                        {(field.value as string)
                                                            .length}/100
                                                        characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldDescription>
                                                Brief assignment description
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row gap-4">
                                <DateTimePicker label="Deadline" />
                                <div className="">
                                    <Label className="mb-2 px-1">Subject</Label>
                                    <SubjectSelector />
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
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
