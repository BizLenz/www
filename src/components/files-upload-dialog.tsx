import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function FilesUploadDialog() {
    return (<Dialog>
        <DialogTrigger asChild>
            <Button>파일 업로드</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>파일 업로드</DialogTitle>
                <DialogDescription>
                    {/* TODO: update supported file formats */}
                    최대 50MB. PDF 지원
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                    {/* TODO: Make actual dnd logics */}
                    <div
                        className="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm">
                        클릭하거나, 파일을 드래그 앤 드랍해주세요.
                    </div>
                </div>
            </div>
            <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        취소
                    </Button>
                </DialogClose>
                <Button>업로드</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>)
}
