"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {CircleCheck} from "lucide-react";

export function FilesUploadDialog() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        setUploadComplete(false);

        // Simulate file upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setUploadComplete(true);
            }
        }, 200);

        // TODO: connect to backend
        // fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData, // Your file data
        // }).then(response => {
        //   // Handle response and update state
        //   setIsUploading(false);
        //   setUploadComplete(true);
        // }).catch(error => {
        //   // Handle error
        //   setIsUploading(false);
        // });
    };

    const handleCloseDialog = () => {
        // Reset when dialog is closed
        setIsUploading(false);
        setUploadProgress(0);
        setUploadComplete(false);
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

                {/* Conditional rendering; upload state */}
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        {!isUploading && !uploadComplete && (
                            <div
                                className="flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm">
                                클릭하거나, 파일을 드래그 앤 드랍해주세요.
                            </div>
                        )}

                        {isUploading && (
                            <div className="flex flex-col items-center gap-4">
                                <Progress value={uploadProgress} className="w-[80%]"/>
                                <p>{uploadProgress}%</p>
                            </div>
                        )}

                        {uploadComplete && (
                            <div
                                className="flex items-center gap-4 text-sm text-green-600 font-semibold">
                                <CircleCheck/>
                                파일 업로드 완료
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="sm:justify-end">
                    {/* Cancel button is visible unless upload is complete */}
                    {!uploadComplete && (
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                                취소
                            </Button>
                        </DialogClose>
                    )}

                    {/* Upload button only when not uploading and not complete */}
                    {!isUploading && !uploadComplete && (
                        <Button type="submit" onClick={handleUpload}>
                            업로드
                        </Button>
                    )}

                    {/* "완료" button only when upload is complete */}
                    {uploadComplete && (
                        <Button type="button" onClick={handleCloseDialog}>
                            완료
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}