import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { GetPermissionModels } from "@/Servises/PermissionModels";

export default function PermissionsAssigner({ value = [], onChange }) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["permission-models"],
    queryFn: GetPermissionModels,
    refetchOnWindowFocus: false,
  });

  const filteredPages = useMemo(() => {
    const term = search.trim().toLowerCase();
    const allPages = data?.permissionModels || [];
    if (!term) return allPages;
    return allPages.filter((page) => page.name.toLowerCase().includes(term));
  }, [data, search]);

  const getActions = (pageName) =>
    value.find((row) => row.model === pageName)?.actions || [];

  const setActions = (pageName, actions) => {
    const others = value.filter((row) => row.model !== pageName);
    onChange(actions.length === 0 ? others : [...others, { model: pageName, actions }]);
  };

  const toggleAction = (pageName, permission) => {
    const current = getActions(pageName);
    const next = current.includes(permission)
      ? current.filter((a) => a !== permission)
      : [...current, permission];
    setActions(pageName, next);
  };

  const toggleAll = (page) => {
    const current = getActions(page.name);
    const allSelected =
      page.permissions.length > 0 && current.length === page.permissions.length;
    setActions(page.name, allSelected ? [] : [...page.permissions]);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chercher par nom"
          className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0050CB] focus:ring-2 focus:ring-[#0050CB]/10"
        />
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Chargement des modèles...</p>
      )}

      {!isLoading && filteredPages.length === 0 && (
        <p className="text-sm text-slate-400">
          Aucun modèle trouvé. Créez-en dans l'onglet "Modèles & Permissions".
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((page) => {
          const current = getActions(page.name);
          const allSelected =
            page.permissions.length > 0 &&
            current.length === page.permissions.length;

          return (
            <div
              key={page._id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <label className="flex cursor-pointer items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#0050CB]"
                  checked={allSelected}
                  onChange={() => toggleAll(page)}
                />
                <span className="text-sm font-semibold text-[#0050CB]">
                  {page.name}
                </span>
              </label>
              <div className="divide-y divide-slate-100">
                {page.permissions.length === 0 && (
                  <p className="px-3 py-2 text-xs italic text-slate-400">
                    Aucune permission définie
                  </p>
                )}
                {page.permissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#0050CB]"
                      checked={current.includes(permission)}
                      onChange={() => toggleAction(page.name, permission)}
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
