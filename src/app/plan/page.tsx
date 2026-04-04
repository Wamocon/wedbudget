import PlanClient from '@/components/plan-client';

type RawSearchParams = Record<string, string | string[] | undefined>;

const getParam = (searchParams: RawSearchParams, key: string): string | undefined => {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0];
  return value;
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolved = await searchParams;
  const isFresh = getParam(resolved, 'fresh') === '1';
  const mode = getParam(resolved, 'mode') === 'basics' ? 'basics' : 'dashboard';

  return <PlanClient isFresh={isFresh} mode={mode} />;
}
