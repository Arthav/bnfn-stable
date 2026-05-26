import { describe, expect, it } from "vitest";
import {
  emptyMassageWorkspaceState,
  loadMassageWorkspaceSnapshot,
  saveMassageWorkspaceSnapshot,
} from "@/lib/massage/storage";

describe("massage storage Adapter", () => {
  it("loads existing localStorage keys", () => {
    const storage = new MemoryStorage();
    storage.setItem("services", JSON.stringify([{ id: 1, name: "Foot" }]));
    storage.setItem("activeStaff", JSON.stringify({ id: 2, name: "Reception" }));

    const snapshot = loadMassageWorkspaceSnapshot(storage);

    expect(snapshot.services).toEqual([{ id: 1, name: "Foot" }]);
    expect(snapshot.activeStaff).toEqual({ id: 2, name: "Reception" });
  });

  it("tolerates malformed JSON and preserves known storage keys on save", () => {
    const storage = new MemoryStorage();
    storage.setItem("workers", "{bad-json");

    expect(loadMassageWorkspaceSnapshot(storage).workers).toEqual([]);

    saveMassageWorkspaceSnapshot(
      {
        ...emptyMassageWorkspaceState,
        staffList: [{ id: 1, name: "Ari", createdAt: "", updatedAt: "" }],
      },
      storage
    );

    expect(JSON.parse(storage.getItem("staffList") || "[]")).toEqual([
      { id: 1, name: "Ari", createdAt: "", updatedAt: "" },
    ]);
  });
});

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}
