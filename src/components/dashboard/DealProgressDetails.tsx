import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Deal = {
  id: number;
  company: string;
  type: string;
  value: number;
  stage: string;
  progress: number;
  owner: string;
  nextStep: string;
  nextStepDate: string;
  blockers: string[];
  stakeholders: number;
  lastActivity: string;
  riskLevel: string;
  closeDate: string;
  probability: number;
  stakeholderDetails?: Array<{ name: string; role: string; lastContact: string; progress: number }>;
};

interface DealProgressDetailsProps {
  deal: Deal | null;
}

const DealProgressDetails: React.FC<DealProgressDetailsProps> = ({ deal }) => {
  // Provide safe defaults when deal is not set
  const progress = deal?.progress ?? 0;
  const company = deal?.company ?? 'Selected Deal';

  // Simple staged timelines with example durations; in real use these would come from data.
  // Redesigned structure: expected vs actual per stage, with node value as percent
  const buyerJourney = [
    { key: 'now', label: 'Now', date: '11/5/21', expectedDays: 48, actualDays: 42, value: 6 },
    { key: 'evaluate', label: 'Evaluate', date: '28/6/21', expectedDays: 32, actualDays: 30, value: 5 },
    { key: 'explore', label: 'Explore', date: '30/7/21', expectedDays: 28, actualDays: 28, value: 2 },
    { key: 'decision', label: 'Decision', date: '27/8/21', expectedDays: 24, actualDays: 24, value: 3 },
    { key: 'solutions', label: 'Solutions', date: '20/9/21', expectedDays: 24, actualDays: 24, value: 4 },
  ];

  const salesProcess = [
    { key: 'prospecting', label: 'Prospecting', date: '11/5/21', expectedDays: 48, actualDays: 40, value: 10 },
    { key: 'qualification', label: 'Qualification', date: '28/6/21', expectedDays: 32, actualDays: 31, value: 30 },
    { key: 'solution', label: 'Solution', date: '30/7/21', expectedDays: 28, actualDays: 25, value: 50 },
    { key: 'proposal', label: 'Proposal', date: '27/8/21', expectedDays: 24, actualDays: 24, value: 65 },
    { key: 'negotiation', label: 'Negotiation', date: '20/9/21', expectedDays: 11, actualDays: 11, value: 85 },
    { key: 'no-decision-won-lost', label: 'No Decision / Won/Lost', date: '1/10/21', expectedDays: 0, actualDays: 0, value: 95 },
  ];

  const totalBuyerExpected = buyerJourney.reduce((a, b) => a + b.expectedDays, 0);
  const totalSalesExpected = salesProcess.reduce((a, b) => a + b.expectedDays, 0);

  // Completion logic: buyer journey by overall progress; sales by stage order
  const completedBuyerCount = Math.max(0, Math.min(buyerJourney.length, Math.round((progress / 100) * buyerJourney.length)));
  const salesOrder = salesProcess.map(s => s.label);
  let currentSalesIndex = Math.max(0, salesOrder.indexOf(deal?.stage ?? ''));
  // 若传入阶段名称为 "No Decision" 或 "Won/Lost"，将其映射到合并后的最后一个节点
  if ((deal?.stage ?? '').toLowerCase().includes('no decision') || (deal?.stage ?? '').toLowerCase().includes('won/lost')) {
    currentSalesIndex = salesProcess.length - 1;
  }

  return (
    <div className="px-0 space-y-4">
      {/* Buyer’s Journey: 卡片 + 标题右侧显示 Time invested */}
      <Card className="shadow-none border border-border rounded-lg bg-transparent">
        <CardHeader className="py-2 px-2">
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-base">Buyer’s Journey</CardTitle>
            <span className="text-xs text-muted-foreground">Time invested: {totalBuyerExpected} days</span>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="mt-1 flex items-end w-full justify-center">
            {buyerJourney.map((s, i) => {
              const completed = i < completedBuyerCount;
              return (
                <React.Fragment key={s.key}>
                  <div className="text-center">
                    {/* Title + date above node */}
                    <div className="mb-1">
                      <div className="text-xs font-medium text-foreground text-center">{s.label}</div>
                      <div className="text-[11px] text-muted-foreground text-center">{s.date}</div>
                    </div>
                    {/* Node */}
                    <div className={`${completed ? 'bg-primary text-white' : 'bg-muted text-foreground'} h-10 w-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold`}>{s.value}</div>
                  </div>
                  {/* Connector with expected vs actual */}
                  {i < buyerJourney.length - 1 && (
                    <div className="relative h-10 flex-1 px-2 flex items-center">
                      {/* 中线虚线：线段左右留白一致，严格处于两节点中间 */}
                      <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-t border-dashed border-muted-foreground/30"></div>
                      {/* 预期周期：虚线上方，颜色区分 */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 text-[10px] text-blue-500">
                        {buyerJourney[i + 1].expectedDays} days
                      </div>
                      {/* 实际周期：虚线下方，颜色区分 */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-[10px] text-orange-500">
                        {buyerJourney[i + 1].actualDays} days
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sales Process: 卡片 + 标题右侧显示 Time invested */}
      <Card className="shadow-none border border-border rounded-lg bg-transparent">
        <CardHeader className="py-2 px-2">
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-base">Sales Process</CardTitle>
            <span className="text-xs text-muted-foreground">Time invested: {totalSalesExpected * 0.5} hours</span>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="mt-1 flex items-end w-full justify-center">
            {salesProcess.map((s, i) => {
              const completed = i <= currentSalesIndex;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-1">
                      <div className="text-xs font-medium text-foreground text-center">
                        {s.key === 'no-decision-won-lost' ? (
                          <>
                            <span>No Decision</span>
                            <br />
                            <span>Won/Lost</span>
                          </>
                        ) : (
                          s.label
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground text-center">{s.date}</div>
                    </div>
                    <div className={`${completed ? 'bg-orange-500 text-white' : 'bg-muted text-foreground'} h-10 w-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold`}>{s.value}%</div>
                  </div>
                  {i < salesProcess.length - 1 && (
                    <div className="relative h-10 flex-1 px-2 flex items-center">
                      {/* 中线虚线：线段左右留白一致，严格处于两节点中间 */}
                      <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-t border-dashed border-muted-foreground/30"></div>
                      {/* 预期周期：虚线上方，颜色区分 */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 text-[10px] text-blue-500">
                        {salesProcess[i + 1].expectedDays} days
                      </div>
                      {/* 实际周期：虚线下方，颜色区分 */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-[10px] text-orange-500">
                        {salesProcess[i + 1].actualDays} days
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealProgressDetails;