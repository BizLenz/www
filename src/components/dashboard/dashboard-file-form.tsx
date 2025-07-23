"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {router} from "next/client";

const formSchema = z.object({
    category: z.string({
        required_error: "Please select a category.",
    }), files: z.any().optional(), // Placeholder for file DND
});

export function DashboardFileForm({}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {
            category: "",
        },
    });

    // TODO: make call to backend
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Form submitted with data:", data);
        try {
            await router.push("/files");
        } catch (error) {
            console.error("Navigation failed:", error);
        }
    }

    return (<div className="border-1 rounded-xl p-5">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Title and Subheading */}
                <div>
                    <h2 className="text-2xl font-bold">새 분석 시작하기</h2>
                    <p className="text-muted-foreground">새로운 파일을 추가하거나, 기존 파일로 분석을 시작하세요</p>
                </div>

                {/* Row with Select Component */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({field}) => (<FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel>분석 종류</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="종류를 선택하세요"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="default">기본 분석</SelectItem>
                                    <SelectItem value="deep">심층 분석</SelectItem>
                                    <SelectItem value="visual">시각화</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <FormMessage/>
                    </FormItem>)}
                />

                {/* Row with File DND (Placeholder) */}
                <FormField
                    control={form.control}
                    name="files"
                    render={() => (<FormItem>
                        <div className="flex flex-col gap-4">
                            <FormLabel>파일 선택</FormLabel>
                            <FormControl>
                                {/* TODO: Make actual dnd logics */}
                                <div
                                    className="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm">
                                    클릭하거나, 파일을 드래그 앤 드랍해주세요.
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </div>
                    </FormItem>)}
                />

                {/* Button */}
                <div className="flex justify-end">
                    <Button type="submit">분석 시작</Button>
                </div>
            </form>
        </Form>
    </div>);
}