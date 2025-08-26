import { create } from "zustand";
import { type File, fileSchema } from "@/types/file";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { getErrorMessage } from "@/lib/utils";

export interface FileState {
  files: File[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
}

const mockData: File[] = [
  {
    id: "file1",
    fileName: "분기별_실적_보고서.pdf",
    uploadDate: "2025-07-24",
    status: "완료",
  },
  {
    id: "file2",
    fileName: "프로젝트_알파_기획안.docx",
    uploadDate: "2025-07-23",
    status: "대기중",
  },
  {
    id: "file3",
    fileName: "사용자_인터뷰_녹취록.txt",
    uploadDate: "2025-07-23",
    status: "대기중",
  },
  {
    id: "file4",
    fileName: "2025년_마케팅_예산안.pdf",
    uploadDate: "2025-07-22",
    status: "완료",
  },
  {
    id: "file5",
    fileName: "경쟁사_분석_자료.pdf",
    uploadDate: "2025-07-21",
    status: "분석중",
  },
  {
    id: "file6",
    fileName: "신규_기능_요구사항.pdf",
    uploadDate: "2025-07-20",
    status: "대기중",
  },
  {
    id: "file7",
    fileName: "서버_로그_20250719.log",
    uploadDate: "2025-07-19",
    status: "완료",
  },
  {
    id: "file8",
    fileName: "디자인_시안_v1.pdf",
    uploadDate: "2025-07-18",
    status: "완료",
  },
  {
    id: "file9",
    fileName: "고객_피드백_종합.csv",
    uploadDate: "2025-07-17",
    status: "분석중",
  },
  {
    id: "file10",
    fileName: "API_명세서_v2.pdf",
    uploadDate: "2025-07-16",
    status: "대기중",
  },
  {
    id: "file11",
    fileName: "백엔드_아키텍처.pdf",
    uploadDate: "2025-07-15",
    status: "완료",
  },
  {
    id: "file12",
    fileName: "주간_업무_보고.md",
    uploadDate: "2025-07-14",
    status: "대기중",
  },
];

export const useFileStore = create<FileState>()((set, get) => ({
  files: [],
  isLoading: false,
  error: null,
  fetchFiles: async () => {
    if (get().isLoading || get().files.length > 0) {
      console.log("Files already loaded or loading, skipping fetch.");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await new Promise<File[]>((resolve) =>
        setTimeout(() => {
          resolve(mockData);
        }, 1000),
      );
      const validatedFiles = z.array(fileSchema).parse(response);
      set({ files: validatedFiles, isLoading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to fetch files:", err.message);
        set({
          error:
            "파일 데이터를 불러오는 데 실패했습니다: " +
            (err.message || "알 수 없는 오류"),
          isLoading: false,
        });
      } else {
        console.error("Failed to fetch files:", err);
        set({
          error:
            "파일 데이터를 불러오는 데 실패했습니다: " + getErrorMessage(err),
          isLoading: false,
        });
      }
    }
  },
}));

export const useFileStoreShallow = () =>
  useFileStore(
    useShallow((state: FileState) => ({
      files: state.files,
      isLoading: state.isLoading,
      error: state.error,
      fetchFiles: state.fetchFiles,
    })),
  );
