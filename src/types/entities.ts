export type ID = number;

export interface User {
  id: ID;
  cognito_sub: string;
  created_at: string;   
  updated_at: string;   
}

export interface BusinessPlan {
  id: ID;
  user_id: ID;
  file_name: string;
  file_path: string;
  file_size?: string | number; // 서버가 BigInt면 문자열로 올 수도 있음
  mime_type?: string;
  created_at: string;
  updated_at: string;
  latest_job_id?: ID | null;
  latest_job?: AnalysisJob | null; // API 응답에서 포함될 수 있도록 여지 둠
}

export type JobType = 'basic' | 'market' | 'financial' | 'technical' | 'risk';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type EvaluationType = 'overall' | 'market' | 'financial' | 'technical' | 'risk';

export interface AnalysisJob {
  id: ID;
  plan_id: ID;
  job_type: JobType;
  status: JobStatus;
  token_usage?: number | null;
  created_at: string;
  results?: AnalysisResult[]; 
}

export interface AnalysisResultBase {
  id: ID;
  analysis_job_id: ID;
  evaluation_type: EvaluationType;
  score?: string | number | null; // Decimal(5,2) 대응
  summary?: string | null;
  details?: unknown; 
  created_at: string;
}

export type AnalysisResult = AnalysisResultBase;
