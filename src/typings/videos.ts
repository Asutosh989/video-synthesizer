export interface GenerateVideoData {
  companyName: string;
  productInfo: string;
  targetGroupProfile: string;
  script: string;
  title: string;
}

export interface CreateVideoResponse {
  createdAt: number;
  id: string;
  lastUpdatedAt: number;
  status: string;
  title:string;
  visibility: String;
  download?: string
}
