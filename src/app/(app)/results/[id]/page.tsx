import { SidebarInset } from "@/components/ui/sidebar";

import {
  type AnalysisResult,
  AnalysisResultSchema,
} from "@/types/analysis-result";

interface ResultPageProps {
  params: {
    id: string;
  };
}

async function getResult(id: string): Promise<AnalysisResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Dummy data
  const dummyData = {
    id,
    fileName: `example-file-${id}.txt`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    updatedAt: new Date().toISOString(),
  };

  return AnalysisResultSchema.parse(dummyData);
  // TODO: fetch backend
  // const res = await fetch(`/results/${id}`, {
  //   cache: "no-store", // always fetch fresh data
  // });
  //
  // if (!res.ok) {
  //   throw new Error(`Failed to fetch result for file ID: ${id}`);
  // }
  //
  // const data = res.json();
  // return AnalysisResultSchema.parse(data);
}

export default async function ResultPage({ params }: ResultPageProps) {
  const result = await getResult(params.id);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10">
        <div className="flex items-baseline">
          <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
            결과 페이지
          </h1>
        </div>
        <div className="border rounded p-4 space-y-2">
          <p>
            <strong>파일 ID:</strong> {result.id}
          </p>
          <p>
            <strong>파일 이름:</strong> {result.fileName}
          </p>
          <p>
            <strong>상태:</strong> {result.status}
          </p>
          <p>
            <strong>생성일:</strong> {new Date(result.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>업데이트일:</strong>{" "}
            {new Date(result.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </SidebarInset>
  );
}
