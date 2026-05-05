export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  category: string;
  date: string;
  location: string;
  analysis: {
    rainfall?: string;
    impact?: string;
    duration?: string;
    affectedArea?: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
}
