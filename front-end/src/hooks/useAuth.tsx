import { useStorageState } from "react-use-storage-state";

export default function useAuth() {
  const [state, setState] = useStorageState<{
    id: number;
    privateKeyBase64: string;
  } | null>("auth", null);

  return { state, setState };
}
