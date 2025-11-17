import React from 'react';
import InfoPopup from './InfoPopup';
import DealProgressDetails from '@/components/dashboard/DealProgressDetails';

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

interface DealProgressPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

const DealProgressPopup: React.FC<DealProgressPopupProps> = ({ open, onOpenChange, deal }) => {
  return (
    <InfoPopup 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Deal Progress" 
      headerRight={<span className="text-sm text-muted-foreground">Time Investment: Buyer’s Journey vs. Seller’s Process</span>} 
      className="!w-[70vw]"
    >
      <DealProgressDetails deal={deal} />
    </InfoPopup>
  );
};

export default DealProgressPopup;