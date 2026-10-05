export interface MemoryEntry {
  timestamp: number;
  stage: string;
  type: "observation" | "decision" | "action" | "verification" | "error" | "repair";
  content: string;
  metadata?: any;
}

export class ProductionMemory {
  private entries: MemoryEntry[] = [];
  private repairAttempts: Map<string, number> = new Map();

  record(stage: string, type: MemoryEntry["type"], content: string, metadata?: any): void {
    this.entries.push({
      timestamp: Date.now(),
      stage,
      type,
      content,
      metadata,
    });
  }

  getRecentObservations(limit = 10): MemoryEntry[] {
    return this.entries
      .filter((e) => e.type === "observation" || e.type === "verification")
      .slice(-limit);
  }

  recordRepairAttempt(actionKey: string): number {
    const current = this.repairAttempts.get(actionKey) || 0;
    const next = current + 1;
    this.repairAttempts.set(actionKey, next);
    return next;
  }

  getRepairAttempts(actionKey: string): number {
    return this.repairAttempts.get(actionKey) || 0;
  }

  hasExceededRepairLimit(actionKey: string, maxAttempts = 3): boolean {
    return this.getRepairAttempts(actionKey) >= maxAttempts;
  }

  getAllEntries(): MemoryEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
    this.repairAttempts.clear();
  }
}
