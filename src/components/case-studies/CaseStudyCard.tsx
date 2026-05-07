import React from 'react';
import Link from 'next/link';
import { CaseStudy } from '@/types/case-study';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  return (
    <article className="bg-sys-layer-01 border border-white/5 rounded-6 overflow-hidden group hover:shadow-floating transition-all duration-300 flex flex-col h-full">
      <div className="aspect-video overflow-hidden">
        <img 
          alt={caseStudy.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          src={caseStudy.image_url} 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-primary px-2 py-0.5 border border-accent-primary/30 rounded-sm">
            {caseStudy.category}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
            {caseStudy.date}
          </span>
        </div>
        <h3 className="text-xl font-medium mb-3 group-hover:text-accent-primary transition-colors">
          {caseStudy.title}
        </h3>
        <p className="text-text-secondary text-sm mb-6 line-clamp-2">
          {caseStudy.summary}
        </p>
        <div className="mt-auto">
          <Link 
            href={`/case-studies/${caseStudy.id}`}
            className="w-full py-3 bg-accent-primary text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-[0.98] transition-all rounded-sm"
          >
            Read More
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
};


export default CaseStudyCard;
