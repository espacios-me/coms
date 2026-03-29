import { trpc } from "@/lib/trpc";

export function useWorkers() {
  const statusQuery = trpc.workers.status.useQuery();
  const logsQuery = trpc.workers.logs.useQuery({ workerId: "" });

  return {
    workers: statusQuery.data?.workers || [],
    workersLoading: statusQuery.isLoading,
    workersError: statusQuery.error?.message,
    refetch: statusQuery.refetch,
  };
}

export function useGitHub() {
  const reposQuery = trpc.github.repos.useQuery();
  const issuesQuery = trpc.github.issues.useQuery();
  const prsQuery = trpc.github.pullRequests.useQuery();

  return {
    repos: reposQuery.data?.repos || [],
    issues: issuesQuery.data?.issues || [],
    prs: prsQuery.data?.prs || [],
    loading: reposQuery.isLoading || issuesQuery.isLoading || prsQuery.isLoading,
    error: reposQuery.error?.message || issuesQuery.error?.message || prsQuery.error?.message,
    refetch: () => {
      reposQuery.refetch();
      issuesQuery.refetch();
      prsQuery.refetch();
    },
  };
}

export function useGoogleDrive() {
  const authUrlQuery = trpc.google.getAuthUrl.useQuery();
  const filesQuery = trpc.google.files.useQuery();
  const saveTokenMutation = trpc.google.saveToken.useMutation();
  return {
    authUrl: authUrlQuery.data?.authUrl,
    files: filesQuery.data?.files || [],
    filesLoading: filesQuery.isLoading,
    filesError: filesQuery.data?.error,
    saveToken: saveTokenMutation.mutateAsync,
    refetch: filesQuery.refetch,
  };
}
