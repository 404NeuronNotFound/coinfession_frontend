"use client";

import { ChevronDown } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import type { AIFeedbackRecord } from "@/types/aiFeedback.types";

interface FeedbackCardProps {
  feedback: AIFeedbackRecord;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FeedbackCard({
  feedback,
  isExpanded,
  onToggle,
}: FeedbackCardProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 7) return isDark ? "bg-green-900/30" : "bg-green-50";
    if (score >= 4) return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    return isDark ? "bg-red-900/30" : "bg-red-50";
  };

  const parsed = feedback.feedback_parsed;

  return (
    <div
      className={`rounded-lg border transition-all ${
        isDark
          ? "bg-background border-border hover:border-primary/50"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-4 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="flex-1 text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
            {feedback.month_label}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {feedback.prompt_summary.substring(0, 100)}
            {feedback.prompt_summary.length > 100 ? "..." : ""}
          </p>
        </div>

        {/* Scores Preview */}
        {parsed?.scores && (
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Discipline</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.discipline)}`}>
                {parsed.scores.discipline}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Risk Mgmt</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.risk_mgmt)}`}>
                {parsed.scores.risk_mgmt}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Consistency</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.consistency)}`}>
                {parsed.scores.consistency}/10
              </p>
            </div>
          </div>
        )}

        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className={`px-6 py-4 sm:py-5 border-t ${
            isDark ? "border-border" : "border-slate-200"
          }`}
        >
          {parsed ? (
            <>
              {/* Scores Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.discipline)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Discipline</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.discipline)}`}>
                    {parsed.scores.discipline}/10
                  </p>
                </div>
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.risk_mgmt)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Risk Management</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.risk_mgmt)}`}>
                    {parsed.scores.risk_mgmt}/10
                  </p>
                </div>
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.consistency)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.consistency)}`}>
                    {parsed.scores.consistency}/10
                  </p>
                </div>
              </div>

              {/* Your Question */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  What You Asked
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  "{feedback.prompt_summary}"
                </p>
              </div>

              {/* Overall Assessment */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Overall Assessment
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {parsed.overall}
                </p>
              </div>

              {/* What's Working */}
              {parsed.whats_working && parsed.whats_working.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-600 mb-3">
                    What's Working
                  </h4>
                  <ul className="space-y-3">
                    {parsed.whats_working.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <div className="flex gap-3">
                          <span className="text-green-600 font-bold mt-0.5">✓</span>
                          <div>
                            <p className="font-semibold text-foreground mb-1">{item.title}</p>
                            <p>{item.body}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Hurting */}
              {parsed.whats_hurting && parsed.whats_hurting.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-red-600 mb-3">
                    What's Hurting
                  </h4>
                  <ul className="space-y-3">
                    {parsed.whats_hurting.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <div className="flex gap-3">
                          <span className="text-red-600 font-bold mt-0.5">✕</span>
                          <div>
                            <p className="font-semibold text-foreground mb-1">{item.title}</p>
                            <p>{item.body}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* One Thing to Fix */}
              {parsed.one_thing_to_fix && (
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    One Thing to Fix
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {parsed.one_thing_to_fix}
                  </p>
                </div>
              )}

              {/* Action Items */}
              {parsed.action_items && parsed.action_items.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Action Items
                  </h4>
                  <div className="space-y-3">
                    {parsed.action_items.map((item, idx) => {
                      const priorityColors = {
                        high: isDark ? "bg-red-900/30 border-red-700/30" : "bg-red-50 border-red-200",
                        medium: isDark ? "bg-yellow-900/30 border-yellow-700/30" : "bg-yellow-50 border-yellow-200",
                        low: isDark ? "bg-blue-900/30 border-blue-700/30" : "bg-blue-50 border-blue-200",
                      };
                      
                      const priorityBadgeColors = {
                        high: "bg-red-600 text-white",
                        medium: "bg-yellow-600 text-white",
                        low: "bg-blue-600 text-white",
                      };

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${priorityColors[item.priority]}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h5 className="text-sm font-semibold text-foreground">
                              {item.title}
                            </h5>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${priorityBadgeColors[item.priority]}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {parsed.market_insights && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Market Insights & Recommendations
                  </h4>
                  
                  {/* Market Trend Summary */}
                  <div className={`rounded-lg p-4 mb-4 ${isDark ? "bg-blue-900/20 border border-blue-700/30" : "bg-blue-50 border border-blue-200"}`}>
                    <p className="text-sm text-muted-foreground">
                      {parsed.market_insights.market_trend_summary}
                    </p>
                  </div>

                  {/* Coin Recommendations */}
                  {parsed.market_insights.coin_recommendations && parsed.market_insights.coin_recommendations.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-foreground mb-2 uppercase">Coin Recommendations</h5>
                      <div className="space-y-2">
                        {parsed.market_insights.coin_recommendations.slice(0, 5).map((coin, idx) => {
                          const recColor = coin.recommendation.includes('STRONG BUY') ? 'text-green-600' :
                                          coin.recommendation.includes('BUY') ? 'text-green-500' :
                                          coin.recommendation.includes('HOLD') ? 'text-yellow-600' :
                                          'text-red-600';
                          
                          return (
                            <div key={idx} className={`p-3 rounded border ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{coin.coin}</p>
                                  <p className={`text-xs font-medium ${recColor}`}>{coin.recommendation}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                                  {coin.confidence}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                <div>
                                  <p className="text-xs">P&L</p>
                                  <p className={coin.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    ${coin.total_pnl.toFixed(0)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs">Win Rate</p>
                                  <p>{coin.win_rate.toFixed(1)}%</p>
                                </div>
                                <div>
                                  <p className="text-xs">Trades</p>
                                  <p>{coin.trades}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Position Type Analysis */}
                  {parsed.market_insights.position_type_analysis && (
                    <div>
                      <h5 className="text-xs font-semibold text-foreground mb-2 uppercase">Position Type Performance</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(parsed.market_insights.position_type_analysis).map(([type, data]: [string, any]) => (
                          <div key={type} className={`p-3 rounded border ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
                            <p className="text-sm font-semibold text-foreground mb-2 capitalize">{type}</p>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Trades:</span>
                                <span className="font-medium">{data.total_trades}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>P&L:</span>
                                <span className={data.total_pnl >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                  ${data.total_pnl.toFixed(0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Win Rate:</span>
                                <span className="font-medium">{data.win_rate.toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-border">
                                <span className="font-semibold">Status:</span>
                                <span className={data.recommendation.includes('FOCUS') ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                                  {data.recommendation}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Per-Trade Analysis */}
              {parsed.per_trade_analysis && parsed.per_trade_analysis.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Recent Trade Analysis
                  </h4>
                  <div className="space-y-3">
                    {parsed.per_trade_analysis.slice(0, 5).map((trade, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          trade.pnl >= 0
                            ? isDark ? "bg-green-900/10 border-green-700/30" : "bg-green-50 border-green-200"
                            : isDark ? "bg-red-900/10 border-red-700/30" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {trade.coin} {trade.position_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {trade.trade_type} @ ${trade.entry_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                            </p>
                            <p className={`text-xs ${trade.pnl_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        
                        {trade.emotions.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">Emotions:</p>
                            <div className="flex flex-wrap gap-1">
                              {trade.emotions.map((emotion, eidx) => (
                                <span key={eidx} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {trade.feedback}
                        </p>
                        
                        <p className={`text-xs font-medium ${
                          trade.recommendation.includes('CLOSED') ? 'text-muted-foreground' :
                          trade.recommendation.includes('HOLD') ? 'text-green-600' :
                          'text-yellow-600'
                        }`}>
                          {trade.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Prompt Summary
              </h4>
              <p className="text-sm text-muted-foreground">
                {feedback.prompt_summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
