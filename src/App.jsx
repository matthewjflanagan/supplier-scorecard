import { useState, useCallback } from "react";

const NAVY = "#1B2A4A";
const NAVY2 = "#253D6B";
const GOLD = "#C8A84B";
const GOLD_LIGHT = "#F5E9C0";
const OFF_WHITE = "#F8F6F0";
const GRAY = "#6B7280";
const LIGHT_GRAY = "#E8E4DC";
const GREEN = "#2E6B3E";
const GREEN_LIGHT = "#D4EDDA";
const RED_COLOR = "#B82424";
const RED_LIGHT = "#FDEAEA";
const AMBER = "#C77B0D";
const AMBER_LIGHT = "#FEF3DC";

const defaultCriteria = [
  { id: 1, name: "Price & Total Cost", weight: 30 },
  { id: 2, name: "Quality Performance", weight: 25 },
  { id: 3, name: "On-Time Delivery", weight: 20 },
  { id: 4, name: "Technical Capability", weight: 15 },
  { id: 5, name: "Financial Health", weight: 10 },
];

const defaultSuppliers = ["Supplier A", "Supplier B", "Supplier C"];

const scoreLabels = {
  0: "",
  1: "Poor",
  2: "Marginal",
  3: "Adequate",
  4: "Strong",
  5: "Exceptional",
};

const scoreColors = {
  0: GRAY,
  1: RED_COLOR,
  2: AMBER,
  3: "#4B7A8A",
  4: "#2E6B3E",
  5: "#1A5C2E",
};

export default function SupplierScorecard() {
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [suppliers, setSuppliers] = useState(defaultSuppliers);
  const [scores, setScores] = useState({});
  const [nextId, setNextId] = useState(6);
  const [activeTab, setActiveTab] = useState("setup");

  const totalWeight = criteria.reduce((s, c) => s + (Number(c.weight) || 0), 0);
  const weightValid = totalWeight === 100;

  const updateCriterion = (id, field, value) => {
    setCriteria(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: field === "weight" ? Number(value) || 0 : value } : c)
    );
  };

  const addCriterion = () => {
    if (criteria.length >= 8) return;
    setCriteria(prev => [...prev, { id: nextId, name: "", weight: 0 }]);
    setNextId(n => n + 1);
  };

  const removeCriterion = (id) => {
    if (criteria.length <= 2) return;
    setCriteria(prev => prev.filter(c => c.id !== id));
    setScores(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateSupplier = (idx, value) => {
    setSuppliers(prev => prev.map((s, i) => i === idx ? value : s));
  };

  const addSupplier = () => {
    if (suppliers.length >= 4) return;
    setSuppliers(prev => [...prev, `Supplier ${String.fromCharCode(65 + prev.length)}`]);
  };

  const removeSupplier = (idx) => {
    if (suppliers.length <= 2) return;
    setSuppliers(prev => prev.filter((_, i) => i !== idx));
  };

  const setScore = (criterionId, supplierIdx, value) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] || {}), [supplierIdx]: value },
    }));
  };

  const getScore = (criterionId, supplierIdx) =>
    scores[criterionId]?.[supplierIdx] ?? 0;

  const getWeightedScore = (supplierIdx) => {
    if (!weightValid) return 0;
    return criteria.reduce((total, c) => {
      const s = getScore(c.id, supplierIdx);
      return total + (s * (c.weight / 100));
    }, 0);
  };

  const getPercentScore = (supplierIdx) =>
    Math.round((getWeightedScore(supplierIdx) / 5) * 100);

  const allScored = criteria.every(c =>
    suppliers.every((_, si) => getScore(c.id, si) > 0)
  );

  const winnerIdx = allScored
    ? suppliers.reduce((best, _, i) =>
        getWeightedScore(i) > getWeightedScore(best) ? i : best, 0)
    : null;

  const maxBar = Math.max(...suppliers.map((_, i) => getPercentScore(i)), 1);

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: OFF_WHITE,
      minHeight: "100vh",
      color: NAVY,
    }}>
      {/* Header */}
      <div style={{
        background: NAVY,
        borderBottom: `3px solid ${GOLD}`,
        padding: "20px 24px 16px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{
              fontFamily: "'Georgia', serif",
              fontSize: 22,
              fontWeight: "bold",
              color: WHITE_TEXT,
              letterSpacing: 1,
            }}>SUPPLIER SCORECARD</span>
            <span style={{
              fontSize: 11,
              color: GOLD,
              fontFamily: "sans-serif",
              letterSpacing: 2,
              fontWeight: "bold",
            }}>EVALUATION TOOL</span>
          </div>
          <div style={{ fontSize: 11, color: "#8BA0C0", marginTop: 4, fontFamily: "sans-serif" }}>
            Matthew Flanagan, CPSM · Flanagan Sourcing Intelligence Portfolio
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: NAVY2,
        borderBottom: `2px solid ${GOLD}`,
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0 }}>
          {[
            { key: "setup", label: "1. Setup" },
            { key: "score", label: "2. Score Suppliers" },
            { key: "results", label: "3. Results" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? GOLD : "transparent",
                color: activeTab === tab.key ? NAVY : "#8BA0C0",
                border: "none",
                padding: "10px 20px",
                fontSize: 12,
                fontFamily: "sans-serif",
                fontWeight: "bold",
                letterSpacing: 1,
                cursor: "pointer",
                borderBottom: activeTab === tab.key ? `2px solid ${GOLD}` : "none",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* ===================== SETUP TAB ===================== */}
        {activeTab === "setup" && (
          <div>
            {/* Criteria */}
            <SectionCard title="Evaluation Criteria" subtitle="Define up to 8 criteria. Weights must total exactly 100%.">
              <div style={{ marginBottom: 12 }}>
                {criteria.map((c, idx) => (
                  <div key={c.id} style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 8,
                    background: idx % 2 === 0 ? "white" : "#F2EFE8",
                    padding: "8px 10px",
                    borderRadius: 4,
                    border: `1px solid ${LIGHT_GRAY}`,
                  }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      background: NAVY,
                      color: GOLD,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      flexShrink: 0,
                    }}>{idx + 1}</span>
                    <input
                      value={c.name}
                      onChange={e => updateCriterion(c.id, "name", e.target.value)}
                      placeholder="Criterion name..."
                      style={{
                        flex: 1,
                        border: `1px solid ${LIGHT_GRAY}`,
                        borderRadius: 4,
                        padding: "6px 10px",
                        fontSize: 13,
                        fontFamily: "'Georgia', serif",
                        color: NAVY,
                        background: "white",
                        outline: "none",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={c.weight || ""}
                        onChange={e => updateCriterion(c.id, "weight", e.target.value)}
                        placeholder="0"
                        style={{
                          width: 56,
                          border: `1px solid ${LIGHT_GRAY}`,
                          borderRadius: 4,
                          padding: "6px 8px",
                          fontSize: 13,
                          fontFamily: "sans-serif",
                          color: NAVY,
                          textAlign: "center",
                          background: "white",
                          outline: "none",
                        }}
                      />
                      <span style={{ fontSize: 12, color: GRAY, fontFamily: "sans-serif" }}>%</span>
                    </div>
                    <button
                      onClick={() => removeCriterion(c.id)}
                      disabled={criteria.length <= 2}
                      style={{
                        background: "none",
                        border: `1px solid ${LIGHT_GRAY}`,
                        borderRadius: 4,
                        width: 26,
                        height: 26,
                        cursor: criteria.length <= 2 ? "not-allowed" : "pointer",
                        color: criteria.length <= 2 ? LIGHT_GRAY : RED_COLOR,
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >×</button>
                  </div>
                ))}
              </div>

              {/* Weight total indicator */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: weightValid ? GREEN_LIGHT : totalWeight > 100 ? RED_LIGHT : AMBER_LIGHT,
                borderRadius: 4,
                border: `1px solid ${weightValid ? GREEN : totalWeight > 100 ? RED_COLOR : AMBER}`,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: "bold",
                  color: weightValid ? GREEN : totalWeight > 100 ? RED_COLOR : AMBER }}>
                  {weightValid ? "✓ Weights total 100% — ready to score" :
                   `Weights total ${totalWeight}% — must equal 100%`}
                </span>
                <span style={{ fontSize: 18, fontWeight: "bold", fontFamily: "sans-serif",
                  color: weightValid ? GREEN : totalWeight > 100 ? RED_COLOR : AMBER }}>
                  {totalWeight}%
                </span>
              </div>

              {criteria.length < 8 && (
                <button onClick={addCriterion} style={addBtnStyle}>
                  + Add Criterion
                </button>
              )}
            </SectionCard>

            {/* Suppliers */}
            <SectionCard title="Suppliers to Evaluate" subtitle="Add 2 to 4 suppliers. Enter the names you want to compare.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                {suppliers.map((s, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "white",
                    border: `1px solid ${LIGHT_GRAY}`,
                    borderRadius: 4,
                    padding: "6px 10px",
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: supplierColors[idx],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 11,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      flexShrink: 0,
                    }}>{String.fromCharCode(65 + idx)}</div>
                    <input
                      value={s}
                      onChange={e => updateSupplier(idx, e.target.value)}
                      style={{
                        border: "none",
                        fontSize: 13,
                        fontFamily: "'Georgia', serif",
                        color: NAVY,
                        width: 140,
                        outline: "none",
                        background: "transparent",
                      }}
                    />
                    <button
                      onClick={() => removeSupplier(idx)}
                      disabled={suppliers.length <= 2}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: suppliers.length <= 2 ? "not-allowed" : "pointer",
                        color: suppliers.length <= 2 ? LIGHT_GRAY : RED_COLOR,
                        fontSize: 16,
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >×</button>
                  </div>
                ))}
                {suppliers.length < 4 && (
                  <button onClick={addSupplier} style={addBtnStyle}>
                    + Add Supplier
                  </button>
                )}
              </div>
            </SectionCard>

            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setActiveTab("score")}
                disabled={!weightValid || criteria.some(c => !c.name)}
                style={{
                  background: weightValid && criteria.every(c => c.name) ? NAVY : LIGHT_GRAY,
                  color: weightValid && criteria.every(c => c.name) ? "white" : GRAY,
                  border: `2px solid ${weightValid && criteria.every(c => c.name) ? GOLD : LIGHT_GRAY}`,
                  borderRadius: 4,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  cursor: weightValid && criteria.every(c => c.name) ? "pointer" : "not-allowed",
                }}
              >
                PROCEED TO SCORING →
              </button>
            </div>
          </div>
        )}

        {/* ===================== SCORE TAB ===================== */}
        {activeTab === "score" && (
          <div>
            <SectionCard
              title="Score Each Supplier"
              subtitle="Rate each supplier 1 to 5 on every criterion. Scores calculate automatically."
            >
              {/* Supplier header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `1fr ${suppliers.map(() => "1fr").join(" ")}`,
                gap: 8,
                marginBottom: 8,
                padding: "0 4px",
              }}>
                <div style={{ fontSize: 11, color: GRAY, fontFamily: "sans-serif", fontWeight: "bold", letterSpacing: 1 }}>
                  CRITERION
                </div>
                {suppliers.map((s, si) => (
                  <div key={si} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                  }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: supplierColors[si],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                    }}>{String.fromCharCode(65 + si)}</div>
                    <span style={{ fontSize: 12, fontWeight: "bold", fontFamily: "sans-serif", color: NAVY }}>
                      {s || `Supplier ${String.fromCharCode(65 + si)}`}
                    </span>
                  </div>
                ))}
              </div>

              {criteria.map((c, cidx) => (
                <div key={c.id} style={{
                  display: "grid",
                  gridTemplateColumns: `1fr ${suppliers.map(() => "1fr").join(" ")}`,
                  gap: 8,
                  marginBottom: 6,
                  background: cidx % 2 === 0 ? "white" : "#F2EFE8",
                  border: `1px solid ${LIGHT_GRAY}`,
                  borderRadius: 4,
                  padding: "10px 10px",
                  alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: "'Georgia', serif", color: NAVY, fontWeight: "bold" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: GRAY, fontFamily: "sans-serif" }}>
                      Weight: {c.weight}%
                    </div>
                  </div>
                  {suppliers.map((_, si) => {
                    const val = getScore(c.id, si);
                    return (
                      <div key={si} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", gap: 3 }}>
                          {[1,2,3,4,5].map(v => (
                            <button
                              key={v}
                              onClick={() => setScore(c.id, si, v)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                border: `1.5px solid ${val >= v ? scoreColors[v] : LIGHT_GRAY}`,
                                background: val === v ? scoreColors[v] : val > v ? `${scoreColors[v]}22` : "white",
                                color: val === v ? "white" : val > v ? scoreColors[v] : GRAY,
                                fontSize: 12,
                                fontWeight: "bold",
                                fontFamily: "sans-serif",
                                cursor: "pointer",
                                transition: "all 0.1s",
                              }}
                            >{v}</button>
                          ))}
                        </div>
                        <span style={{
                          fontSize: 10,
                          fontFamily: "sans-serif",
                          color: val > 0 ? scoreColors[val] : LIGHT_GRAY,
                          fontWeight: "bold",
                          letterSpacing: 0.5,
                          height: 14,
                        }}>
                          {scoreLabels[val]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Running totals */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `1fr ${suppliers.map(() => "1fr").join(" ")}`,
                gap: 8,
                marginTop: 12,
                background: NAVY,
                borderRadius: 4,
                padding: "12px 10px",
                border: `2px solid ${GOLD}`,
              }}>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: "bold", color: GOLD, letterSpacing: 1 }}>
                  CURRENT SCORE
                </div>
                {suppliers.map((s, si) => {
                  const pct = getPercentScore(si);
                  return (
                    <div key={si} style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: pct >= 70 ? "#6EE89A" : pct >= 50 ? GOLD : "#F87171",
                      }}>
                        {weightValid ? `${pct}` : "--"}
                      </div>
                      <div style={{ fontSize: 10, color: "#8BA0C0", fontFamily: "sans-serif" }}>/ 100</div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setActiveTab("results")}
                style={{
                  background: NAVY,
                  color: "white",
                  border: `2px solid ${GOLD}`,
                  borderRadius: 4,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                VIEW RESULTS →
              </button>
            </div>
          </div>
        )}

        {/* ===================== RESULTS TAB ===================== */}
        {activeTab === "results" && (
          <div>
            {/* Winner banner */}
            {winnerIdx !== null && (
              <div style={{
                background: NAVY,
                border: `2px solid ${GOLD}`,
                borderRadius: 6,
                padding: "16px 20px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}>★</div>
                <div>
                  <div style={{ fontSize: 11, color: GOLD, fontFamily: "sans-serif", fontWeight: "bold", letterSpacing: 2 }}>
                    RECOMMENDED AWARD
                  </div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "white", fontFamily: "'Georgia', serif" }}>
                    {suppliers[winnerIdx] || `Supplier ${String.fromCharCode(65 + winnerIdx)}`}
                  </div>
                  <div style={{ fontSize: 12, color: "#8BA0C0", fontFamily: "sans-serif" }}>
                    Highest weighted score: {getPercentScore(winnerIdx)} out of 100
                  </div>
                </div>
              </div>
            )}

            {!allScored && (
              <div style={{
                background: AMBER_LIGHT,
                border: `1px solid ${AMBER}`,
                borderRadius: 4,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12,
                fontFamily: "sans-serif",
                color: AMBER,
                fontWeight: "bold",
              }}>
                ⚠ Some criteria have not been scored. Complete all scores to see the final recommendation.
              </div>
            )}

            {/* Bar chart */}
            <SectionCard title="Score Comparison" subtitle="Weighted scores normalized to a 100-point scale.">
              <div style={{ padding: "8px 0" }}>
                {suppliers.map((s, si) => {
                  const pct = getPercentScore(si);
                  const isWinner = si === winnerIdx;
                  return (
                    <div key={si} style={{ marginBottom: 16 }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 6,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: supplierColors[si],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 11,
                            fontWeight: "bold",
                            fontFamily: "sans-serif",
                          }}>{String.fromCharCode(65 + si)}</div>
                          <span style={{
                            fontSize: 14,
                            fontFamily: "'Georgia', serif",
                            fontWeight: isWinner ? "bold" : "normal",
                            color: NAVY,
                          }}>
                            {s || `Supplier ${String.fromCharCode(65 + si)}`}
                            {isWinner && allScored && (
                              <span style={{ fontSize: 11, color: GOLD, marginLeft: 8, fontFamily: "sans-serif", fontWeight: "bold" }}>
                                ★ WINNER
                              </span>
                            )}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          fontFamily: "sans-serif",
                          color: pct >= 70 ? GREEN : pct >= 50 ? AMBER : RED_COLOR,
                        }}>
                          {weightValid ? pct : "--"}
                        </span>
                      </div>
                      <div style={{
                        height: 20,
                        background: LIGHT_GRAY,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${weightValid ? pct : 0}%`,
                          background: isWinner && allScored
                            ? `linear-gradient(90deg, ${NAVY2}, ${NAVY})`
                            : supplierColors[si],
                          borderRadius: 3,
                          transition: "width 0.5s ease",
                          position: "relative",
                        }}>
                          {isWinner && allScored && (
                            <div style={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: GOLD,
                              fontSize: 11,
                              fontWeight: "bold",
                            }}>★</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Detailed breakdown */}
            <SectionCard title="Criterion-by-Criterion Breakdown" subtitle="Weighted contribution of each criterion to the total score.">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "sans-serif" }}>
                  <thead>
                    <tr style={{ background: NAVY }}>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "white", fontWeight: "bold", fontSize: 11 }}>
                        CRITERION
                      </th>
                      <th style={{ padding: "8px 10px", textAlign: "center", color: GOLD, fontSize: 11 }}>
                        WEIGHT
                      </th>
                      {suppliers.map((s, si) => (
                        <th key={si} style={{ padding: "8px 10px", textAlign: "center", color: "white", fontSize: 11 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%",
                              background: supplierColors[si],
                              fontSize: 9, display: "flex", alignItems: "center",
                              justifyContent: "center", color: "white", fontWeight: "bold",
                            }}>{String.fromCharCode(65 + si)}</div>
                            <span>{s || `Supplier ${String.fromCharCode(65 + si)}`}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c, cidx) => (
                      <tr key={c.id} style={{ background: cidx % 2 === 0 ? "white" : "#F2EFE8" }}>
                        <td style={{ padding: "8px 10px", color: NAVY, fontFamily: "'Georgia', serif", fontSize: 13 }}>
                          {c.name}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", color: GRAY, fontWeight: "bold" }}>
                          {c.weight}%
                        </td>
                        {suppliers.map((_, si) => {
                          const raw = getScore(c.id, si);
                          const weighted = raw * (c.weight / 100);
                          const bestInRow = Math.max(...suppliers.map((_, i) => getScore(c.id, i)));
                          const isBest = raw === bestInRow && raw > 0;
                          return (
                            <td key={si} style={{ padding: "8px 10px", textAlign: "center" }}>
                              <div style={{
                                display: "inline-flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                              }}>
                                <span style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 4,
                                  background: raw > 0 ? `${scoreColors[raw]}18` : LIGHT_GRAY,
                                  border: `1.5px solid ${raw > 0 ? scoreColors[raw] : LIGHT_GRAY}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 13,
                                  fontWeight: "bold",
                                  color: raw > 0 ? scoreColors[raw] : GRAY,
                                }}>
                                  {raw || "–"}
                                </span>
                                <span style={{ fontSize: 9, color: GRAY }}>
                                  {raw > 0 && weightValid ? `+${weighted.toFixed(2)}` : ""}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr style={{ background: NAVY, borderTop: `2px solid ${GOLD}` }}>
                      <td style={{ padding: "10px", color: GOLD, fontWeight: "bold", fontSize: 12 }}>
                        TOTAL WEIGHTED SCORE
                      </td>
                      <td style={{ padding: "10px", textAlign: "center", color: "#8BA0C0", fontSize: 11 }}>
                        100%
                      </td>
                      {suppliers.map((_, si) => {
                        const pct = getPercentScore(si);
                        const isWin = si === winnerIdx && allScored;
                        return (
                          <td key={si} style={{ padding: "10px", textAlign: "center" }}>
                            <span style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: isWin ? GOLD : pct >= 70 ? "#6EE89A" : pct >= 50 ? "#FCD34D" : "#F87171",
                            }}>
                              {weightValid ? pct : "--"}
                            </span>
                            {isWin && (
                              <span style={{ color: GOLD, marginLeft: 4, fontSize: 14 }}>★</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Reset button */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                onClick={() => {
                  setScores({});
                  setActiveTab("setup");
                }}
                style={{
                  background: "transparent",
                  border: `1px solid ${LIGHT_GRAY}`,
                  borderRadius: 4,
                  padding: "8px 20px",
                  fontSize: 12,
                  fontFamily: "sans-serif",
                  color: GRAY,
                  cursor: "pointer",
                  letterSpacing: 1,
                }}
              >
                ↺ START NEW EVALUATION
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: NAVY,
        borderTop: `2px solid ${GOLD}`,
        padding: "12px 24px",
        textAlign: "center",
      }}>
        <span style={{ fontSize: 10, color: "#8BA0C0", fontFamily: "sans-serif", letterSpacing: 1 }}>
          FLANAGAN SOURCING INTELLIGENCE PORTFOLIO · MATTHEW FLANAGAN, CPSM · CHARLOTTE, NC
        </span>
      </div>
    </div>
  );
}

// Helpers
const WHITE_TEXT = "white";

const supplierColors = [
  "#1B2A4A",
  "#2E6B3E",
  "#C77B0D",
  "#6B3A8A",
];

const addBtnStyle = {
  background: "white",
  border: `1.5px dashed #C8A84B`,
  borderRadius: 4,
  padding: "6px 14px",
  fontSize: 12,
  fontFamily: "sans-serif",
  color: "#C8A84B",
  fontWeight: "bold",
  cursor: "pointer",
  letterSpacing: 0.5,
};

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: "white",
      border: `1px solid #E8E4DC`,
      borderRadius: 6,
      marginBottom: 20,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        background: "#F2EFE8",
        borderBottom: `2px solid #C8A84B`,
        padding: "10px 16px",
      }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#1B2A4A", fontFamily: "sans-serif", letterSpacing: 0.5 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "sans-serif", marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ padding: "16px" }}>
        {children}
      </div>
    </div>
  );
}