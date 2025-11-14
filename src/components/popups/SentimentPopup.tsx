import React from 'react';
import InfoPopup from './InfoPopup';
import StakeholderSentimentPanel from '@/components/dashboard/StakeholderSentimentPanel';

type Stakeholder = { name: string; role: string; lastContact: string; progress: number };
type Deal = { company: string; stakeholderDetails?: Stakeholder[] };

interface SentimentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

const SentimentPopup: React.FC<SentimentPopupProps> = ({ open, onOpenChange, deal }) => {
  return (
    <InfoPopup open={open} onOpenChange={onOpenChange} title="Stakeholder Sentiment">
      <StakeholderSentimentPanel deal={deal} />
    </InfoPopup>
  );
};

export default SentimentPopup;