import { UserRole } from "@/api/rolePermissionApi";
import { create } from "zustand";

interface RoleListStore {
  roles: UserRole[];
  setRoles: (items: UserRole[]) => void;
}

export const useRoleListStore = create<RoleListStore>((set) => ({
  roles: [],
  setRoles: (items: UserRole[]) => set(() => ({ roles: items })),
}));
