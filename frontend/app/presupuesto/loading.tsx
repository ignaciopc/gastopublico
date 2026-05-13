import { PageLoader } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageLoader />
    </div>
  );
}
