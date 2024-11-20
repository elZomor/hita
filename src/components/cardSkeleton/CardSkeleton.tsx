import { GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';

export function CardSkeleton() {
  return (
    <div className="p-2 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm p-4overflow-hidden rounded-xl hover:shadow-md">
      <div className="relative h-[250px] rounded-md overflow-hidden mb-2 bg-slate-200 animate-pulse"></div>

      <div className="p-1 mb-2">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="h-3 pr-4 text-base font-semibold text-gray-900 break-words bg-slate-200 animate-pulse"></h3>
              <div
                className={clsx(
                  'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-slate-400 animate-pulse'
                )}
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <GraduationCap className="flex-shrink-0 w-4 h-4" />
              <span className="h-3 break-words bg-slate-200 animate-pulse"></span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3]?.map((skill) => (
              <span
                key={skill}
                className="inline-flex h-3 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-400 animate-pulse text-purple-800"
              ></span>
            ))}
          </div>
        </div>

        <p className="h-5 mt-3 text-sm text-gray-600 bg-slate-200 animate-pulse"></p>
      </div>
    </div>
  );
}
