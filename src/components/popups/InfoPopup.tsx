import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InfoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ open, onOpenChange, title, children, className, headerRight }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-[40vw] max-w-6xl max-h-[80vh] overflow-y-auto ${className ?? ''}`}>
        {title && (
          <DialogHeader>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
              <div className="justify-self-start">
                <DialogTitle>{title}</DialogTitle>
              </div>
              {headerRight && (
                <div className="justify-self-center">{headerRight}</div>
              )}
              <div></div>
            </div>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default InfoPopup;