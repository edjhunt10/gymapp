"use client";

import { useStore, selectTodayEntries, computeMacrosForEntries } from "@/lib/store";
import { Button, Card, Input, Label, PageTitle, ProgressBar } from "@/components/ui/primitives";
import { Plus, Trash2, X, Search, Settings, Coffee, Soup, UtensilsCrossed, Cookie } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { MealType, Food } from "@/lib/types";

const MEALS: { key: MealType; label: string; icon: any }[] = [
  { key: "breakfast", label: "Breakfast", icon: Coffee },
  { key: "lunch", label: "Lunch", icon: Soup },
  { key: "dinner", label: "Dinner", icon: UtensilsCrossed },
  { key: "snack", label: "Snacks", icon: Cookie },
];

export default function MacrosPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const foodEntries = useStore((s) => s.foodEntries);
  const foods = useStore((s) => s.foods);
  const targets = useStore((s) => s.macroTargets);
  const setTargets = useStore((s) => s.setMacroTargets);
  const removeFoodEntry = useStore((s) => s.removeFoodEntry);
  const logFood = useStore((s) => s.logFood);

  const [showAdd, setShowAdd] = useState<MealType | null>(null);
  const [showTargets, setShowTargets] = useState(false);

  if (!mounted) return null;

  const today = selectTodayEntries({ foodEntries } as any);
  const macros = computeMacrosForEntries(today, foods);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <PageTitle sub="Today's intake">Macros</PageTitle>
        <Button size="sm" variant="ghost" onClick={() => setShowTargets(true)}>
          <Settings size={16} />
        </Button>
      </div>

      {/* Daily summary */}
      <Card>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted mb-1">Calories</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl">{Math.round(macros.kcal)}</span>
              <span className="text-muted text-sm">/ {targets.kcal}</span>
            </div>
            <ProgressBar value={macros.kcal} max={targets.kcal} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted mb-1">Remaining</div>
            <div className="flex items-baseline gap-2">
              <span className={`font-display font-bold text-3xl ${macros.kcal > targets.kcal ? "text-danger" : "text-accent"}`}>
                {Math.round(targets.kcal - macros.kcal)}
              </span>
              <span className="text-muted text-sm">kcal</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MacroBar label="Protein" value={macros.protein} target={targets.protein} color="blue" />
          <MacroBar label="Carbs" value={macros.carbs} target={targets.carbs} color="orange" />
          <MacroBar label="Fat" value={macros.fat} target={targets.fat} color="pink" />
        </div>
      </Card>

      {/* Meals */}
      <div className="space-y-3">
        {MEALS.map((meal) => {
          const entries = today.filter((e) => e.meal === meal.key);
          const mealMacros = computeMacrosForEntries(entries, foods);
          const Icon = meal.icon;
          return (
            <Card key={meal.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-muted" />
                  <h3 className="font-display font-bold">{meal.label}</h3>
                  {entries.length > 0 && (
                    <span className="text-xs text-muted">
                      · {Math.round(mealMacros.kcal)} kcal
                    </span>
                  )}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowAdd(meal.key)}>
                  <Plus size={14} /> Add
                </Button>
              </div>
              {entries.length === 0 ? (
                <p className="text-muted text-xs italic">Nothing logged.</p>
              ) : (
                <div className="space-y-1">
                  {entries.map((e) => {
                    const f = foods.find((fd) => fd.id === e.foodId);
                    if (!f) return null;
                    const factor = f.unit === "100g" ? e.amount / 100 : e.amount;
                    return (
                      <div key={e.id} className="flex items-center justify-between py-1.5 group">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{f.name}</div>
                          <div className="text-xs text-muted">
                            {f.unit === "100g" ? `${e.amount}g` : `${e.amount} × ${f.servingLabel ?? "serving"}`}
                            {" · "}
                            <span className="font-mono">{Math.round(f.kcal * factor)} kcal</span>
                            {" · "}
                            <span className="font-mono">P{Math.round(f.protein * factor)}</span>
                            {" "}
                            <span className="font-mono">C{Math.round(f.carbs * factor)}</span>
                            {" "}
                            <span className="font-mono">F{Math.round(f.fat * factor)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFoodEntry(e.id)}
                          className="text-muted hover:text-danger p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showAdd && (
        <FoodPicker
          meal={showAdd}
          onClose={() => setShowAdd(null)}
        />
      )}

      {showTargets && (
        <TargetsModal targets={targets} onSave={setTargets} onClose={() => setShowTargets(false)} />
      )}
    </div>
  );
}

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: "blue" | "orange" | "pink" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        <span className="font-mono text-xs">
          <span className="font-bold">{Math.round(value)}</span>
          <span className="text-muted">/{target}g</span>
        </span>
      </div>
      <ProgressBar value={value} max={target} color={color} />
    </div>
  );
}

function FoodPicker({ meal, onClose }: { meal: MealType; onClose: () => void }) {
  const foods = useStore((s) => s.foods);
  const logFood = useStore((s) => s.logFood);
  const addFood = useStore((s) => s.addFood);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Food | null>(null);
  const [amount, setAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({ name: "", unit: "100g" as "100g" | "serving", servingLabel: "", kcal: "", protein: "", carbs: "", fat: "" });

  const filtered = useMemo(() => {
    if (!q) return foods.slice(0, 30);
    return foods.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
  }, [foods, q]);

  return (
    <div className="fixed inset-0 z-30 bg-bg/95 backdrop-blur-sm flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex flex-col h-full p-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-display font-bold text-xl flex-1 capitalize">Add to {meal}</h2>
          <button onClick={onClose} className="text-muted p-1">
            <X size={20} />
          </button>
        </div>

        {!picked && !showCustom && (
          <>
            <div className="flex items-center gap-2 bg-elevated border border-border rounded px-3 mb-3">
              <Search size={16} className="text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search foods..."
                className="flex-1 bg-transparent outline-none py-3 text-base"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {filtered.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setPicked(f);
                    setAmount(f.unit === "100g" ? "100" : "1");
                  }}
                  className="w-full text-left p-3 rounded hover:bg-elevated transition-colors"
                >
                  <div className="font-semibold text-sm">{f.name}</div>
                  <div className="text-xs text-muted font-mono">
                    {f.kcal}kcal · P{f.protein} C{f.carbs} F{f.fat}
                    {f.unit === "100g" ? " / 100g" : ` / ${f.servingLabel}`}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-muted text-sm text-center py-8">No matches.</p>
              )}
            </div>

            <Button variant="secondary" onClick={() => setShowCustom(true)} className="mt-3">
              <Plus size={14} /> Create Custom Food
            </Button>
          </>
        )}

        {picked && (
          <div className="space-y-4">
            <Card>
              <div className="font-display font-bold text-lg">{picked.name}</div>
              <div className="text-xs text-muted font-mono">
                {picked.kcal}kcal · P{picked.protein} C{picked.carbs} F{picked.fat}
                {picked.unit === "100g" ? " / 100g" : ` / ${picked.servingLabel}`}
              </div>
            </Card>

            <div>
              <Label>{picked.unit === "100g" ? "Grams" : "Servings"}</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="mt-1 text-2xl text-center"
              />
            </div>

            {amount && (() => {
              const a = parseFloat(amount) || 0;
              const factor = picked.unit === "100g" ? a / 100 : a;
              return (
                <Card>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="font-mono font-bold text-lg">{Math.round(picked.kcal * factor)}</div>
                      <div className="text-[10px] uppercase text-muted">kcal</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-lg text-blue-400">{Math.round(picked.protein * factor)}g</div>
                      <div className="text-[10px] uppercase text-muted">protein</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-lg text-orange-400">{Math.round(picked.carbs * factor)}g</div>
                      <div className="text-[10px] uppercase text-muted">carbs</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-lg text-pink-400">{Math.round(picked.fat * factor)}g</div>
                      <div className="text-[10px] uppercase text-muted">fat</div>
                    </div>
                  </div>
                </Card>
              );
            })()}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setPicked(null)}>Back</Button>
              <Button
                onClick={() => {
                  const a = parseFloat(amount);
                  if (!a || a <= 0) return;
                  logFood({ foodId: picked.id, amount: a, meal });
                  onClose();
                }}
              >
                Log Food
              </Button>
            </div>
          </div>
        )}

        {showCustom && (
          <div className="space-y-3 overflow-y-auto">
            <h3 className="font-display font-bold">New Food</h3>
            <div>
              <Label>Name</Label>
              <Input value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button
                className={`flex-1 h-10 rounded text-sm font-semibold ${custom.unit === "100g" ? "bg-accent text-bg" : "bg-elevated text-muted"}`}
                onClick={() => setCustom({ ...custom, unit: "100g" })}
              >
                Per 100g
              </button>
              <button
                className={`flex-1 h-10 rounded text-sm font-semibold ${custom.unit === "serving" ? "bg-accent text-bg" : "bg-elevated text-muted"}`}
                onClick={() => setCustom({ ...custom, unit: "serving" })}
              >
                Per serving
              </button>
            </div>
            {custom.unit === "serving" && (
              <div>
                <Label>Serving label (e.g. "1 scoop")</Label>
                <Input value={custom.servingLabel} onChange={(e) => setCustom({ ...custom, servingLabel: e.target.value })} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div><Label>kcal</Label><Input type="number" value={custom.kcal} onChange={(e) => setCustom({ ...custom, kcal: e.target.value })} /></div>
              <div><Label>Protein (g)</Label><Input type="number" value={custom.protein} onChange={(e) => setCustom({ ...custom, protein: e.target.value })} /></div>
              <div><Label>Carbs (g)</Label><Input type="number" value={custom.carbs} onChange={(e) => setCustom({ ...custom, carbs: e.target.value })} /></div>
              <div><Label>Fat (g)</Label><Input type="number" value={custom.fat} onChange={(e) => setCustom({ ...custom, fat: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setShowCustom(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!custom.name.trim()) return;
                  const id = addFood({
                    name: custom.name.trim(),
                    unit: custom.unit,
                    servingLabel: custom.servingLabel || undefined,
                    kcal: parseFloat(custom.kcal) || 0,
                    protein: parseFloat(custom.protein) || 0,
                    carbs: parseFloat(custom.carbs) || 0,
                    fat: parseFloat(custom.fat) || 0,
                  });
                  const newFood = useStore.getState().foods.find((f) => f.id === id)!;
                  setShowCustom(false);
                  setPicked(newFood);
                  setAmount(newFood.unit === "100g" ? "100" : "1");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TargetsModal({
  targets, onSave, onClose,
}: {
  targets: { kcal: number; protein: number; carbs: number; fat: number };
  onSave: (t: { kcal: number; protein: number; carbs: number; fat: number }) => void;
  onClose: () => void;
}) {
  const [t, setT] = useState(targets);
  return (
    <div className="fixed inset-0 z-30 bg-bg/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-md slide-up">
        <h3 className="font-display font-bold text-xl mb-4">Daily Targets</h3>
        <div className="space-y-3">
          <div><Label>Calories</Label><Input type="number" value={t.kcal} onChange={(e) => setT({ ...t, kcal: parseInt(e.target.value) || 0 })} /></div>
          <div><Label>Protein (g)</Label><Input type="number" value={t.protein} onChange={(e) => setT({ ...t, protein: parseInt(e.target.value) || 0 })} /></div>
          <div><Label>Carbs (g)</Label><Input type="number" value={t.carbs} onChange={(e) => setT({ ...t, carbs: parseInt(e.target.value) || 0 })} /></div>
          <div><Label>Fat (g)</Label><Input type="number" value={t.fat} onChange={(e) => setT({ ...t, fat: parseInt(e.target.value) || 0 })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(t); onClose(); }}>Save</Button>
        </div>
      </Card>
    </div>
  );
}
