import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Link,
  Info,
  Share,
  Download,
  Settings
} from 'lucide-react';
import DealProgressTracker from './DealProgressTracker';
import StakeholderInsights from './StakeholderInsights';
import OrgChartMapping from './OrgChartMapping';

const ForecastDashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="sticky top-0 z-30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-bold text-foreground">Deal Intelligence</h1>
            <p className="text-muted-foreground">
              {formatDateTime(currentDateTime)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            {/*<Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transcript
            </Button>
            <Button variant="outline" size="sm">
              <Link className="h-4 w-4 mr-2" />
              Associate With
            </Button>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Meeting Info
            </Button>*/}
            
            {/* Divider */}
            {/*<div className="h-6 w-px bg-border mx-2" />*/}
            
            {/* Icon Buttons
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>*/}
          </div>
        </div>

        {/* Forecast Accuracy Components - Only keep three tabs */}
        <Card className="bg-white border-0 shadow-none">
          <CardContent>
            <DealProgressTracker period="Q1 2025" team="all" searchQuery="" />
            {/* <Tabs defaultValue="deal-progress" className="w-full">
              <TabsList className="w-fit rounded-lg bg-muted p-1">
                <TabsTrigger value="deal-progress" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Deal Progress</TabsTrigger>
                <TabsTrigger value="stakeholders" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Stakeholders</TabsTrigger>
                <TabsTrigger value="org-chart" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Org Chart</TabsTrigger>
              </TabsList>

              <TabsContent value="deal-progress" className="mt-4">
                <DealProgressTracker period="Q1 2024" team="all" searchQuery="" />
              </TabsContent>

              <TabsContent value="stakeholders" className="mt-4">
                <StakeholderInsights period="Q1 2024" team="all" searchQuery="" />
              </TabsContent>

              <TabsContent value="org-chart" className="mt-4">
                <OrgChartMapping period="Q1 2024" team="all" searchQuery="" />
              </TabsContent>
            </Tabs> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForecastDashboard;