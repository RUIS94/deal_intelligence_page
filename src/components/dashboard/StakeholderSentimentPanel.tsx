import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Stakeholder = { name: string; role: string; lastContact: string; progress: number };

type Deal = {
  company: string;
  stakeholderDetails?: Stakeholder[];
};

interface StakeholderSentimentPanelProps {
  deal: Deal | null;
}

function computeThumb(progress: number) {
  if (progress >= 70) return { labelCn: '好', level: 'good' as const, Icon: ThumbsUp, color: 'text-green-600' };
  if (progress >= 40) return { labelCn: '中等', level: 'medium' as const, Icon: ThumbsUp, color: 'text-amber-500' };
  return { labelCn: '差', level: 'bad' as const, Icon: ThumbsDown, color: 'text-red-600' };
}

function computeRisk(progress: number) {
  if (progress < 30) return { label: 'At Risk', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
  if (progress < 50) return { label: 'Watch', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
  return { label: 'Stable', color: 'bg-green-500/10 text-green-600 border-green-500/20' };
}

const StakeholderSentimentPanel: React.FC<StakeholderSentimentPanelProps> = ({ deal }) => {
  const buyers = deal?.stakeholderDetails ?? [];
  // 示例 sellers 列表（可后续替换为真实数据来源）
  const sellers: { name: string; title: string }[] = [
    { name: 'Sarah Johnson', title: 'Account Executive' },
    { name: 'Michael Chen', title: 'Sales Manager' },
    { name: 'Noah Lee', title: 'Sales Development Rep' },
  ];

  const gridTemplateColumns = `220px repeat(${buyers.length}, minmax(160px, 1fr))`;

  const countFor = (sellerIndex: number, progress: number) => {
    // 根据 buyer 的 progress 与 seller 索引生成次数，模拟评价频次
    return Math.max(1, Math.floor(progress / 10) + (sellerIndex % 3));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="overflow-x-auto w-full">
        <div
          className="inline-grid w-full gap-px"
          style={{ gridTemplateColumns }}
        >
          {/* 顶部标签行：左侧占位；Buyers 独立一行位于买方表头之上 */}
          <div className="p-2" aria-hidden></div>
          <div className="p-2 text-sm font-semibold text-foreground">Buyers</div>
          {Array.from({ length: Math.max(0, buyers.length - 1) }).map((_, i) => (
            <div key={`label-spacer-${i}`} className="p-2" aria-hidden></div>
          ))}

          {/* 顶部表头行：第一列显示 Sellers 标签（置底）；买方为头像+姓名+职称 */}
          <div className="p-3 flex h-full flex-col justify-end"><div className="text-sm font-semibold text-foreground">Sellers</div></div>
          {buyers.map((b) => (
            <div key={b.name} className="bg-muted/40 p-3 flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{b.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.role}</div>
                </div>
              </div>
            </div>
          ))}

          

          {/* 每个 seller 的一行：左侧头像+姓名+职称 + 每个 buyer 的评价格子 */}
          {sellers.map((seller, si) => (
            <React.Fragment key={seller.name}>
              <div className="bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{seller.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{seller.title}</div>
                  </div>
                </div>
              </div>
              {buyers.map((b) => {
                const thumb = computeThumb(b.progress);
                const count = countFor(si, b.progress);
                const Icon = thumb.Icon;
                return (
                  <div key={`${seller.name}-${b.name}`} className="bg-white p-2 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${thumb.color}`} />
                      <span className="text-sm font-medium text-foreground">{count}</span>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakeholderSentimentPanel;