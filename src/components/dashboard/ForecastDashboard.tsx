import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
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
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [periodSelection, setPeriodSelection] = useState<string>('Q1 2025');
  const [teamValue, setTeamValue] = useState<string>('All Teams');
  const [individualValue, setIndividualValue] = useState<string>('All Individuals');

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
            <p className="text-sm text-muted-foreground">
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
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Select value={viewMode} onValueChange={(v) => { if (v) { const m = v as 'monthly' | 'quarterly' | 'yearly'; setViewMode(m); const opts = getPeriodOptions(m); setPeriodSelection(opts[0]); } }}>
                  <SelectTrigger className="h-9 w-32 bg-white">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periodSelection} onValueChange={setPeriodSelection}>
                  <SelectTrigger className="h-9 w-44 bg-white">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {getPeriodOptions(viewMode).map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={teamValue} onValueChange={setTeamValue}>
                  <SelectTrigger className="h-9 w-40 bg-white">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="All Teams">All Teams</SelectItem>
                    <SelectItem value="Account Executive">Account Executive</SelectItem>
                    <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                    <SelectItem value="Sales Development Rep">Sales Development Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={individualValue} onValueChange={setIndividualValue}>
                  <SelectTrigger className="h-9 w-44 bg-white">
                    <SelectValue placeholder="Select individual" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="All Individuals">All Users</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                    <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                    <SelectItem value="David Kim">David Kim</SelectItem>
                    <SelectItem value="Olivia Park">Olivia Park</SelectItem>
                    <SelectItem value="Noah Lee">Noah Lee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
  const getPeriodOptions = (mode: 'monthly' | 'quarterly' | 'yearly') => {
    if (mode === 'monthly') {
      return [
        'Jan 2025','Feb 2025','Mar 2025','Apr 2025','May 2025','Jun 2025',
        'Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025'
      ];
    }
    if (mode === 'quarterly') {
      return ['Q1 2025','Q2 2025','Q3 2025','Q4 2025'];
    }
    return ['2024','2025','2026'];
  };
