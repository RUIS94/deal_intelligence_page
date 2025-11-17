import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
  import { 
    AlertTriangle, 
    Calendar, 
    ChevronRight,
    Clock,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    User,
    CheckCircle,
    XCircle,
    X,
    Eye,
    Mail,
  Phone,
  MessageSquare,
  Video,
  Trash2,
  Crown,
  Heart,
  SlidersHorizontal,
  Pencil,
  FileText,
  Filter,
  MoreVertical,
  Search,
  Check,
  Tag,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert
} from 'lucide-react';
import OrgChartMapping from './OrgChartMapping';
import DealProgressDetails from './DealProgressDetails';
import StakeholderSentimentPanel from './StakeholderSentimentPanel';
import OrgChartPopup from '@/components/popups/OrgChartPopup';
import DealProgressPopup from '@/components/popups/DealProgressPopup';
import InfoPopup from '@/components/popups/InfoPopup';

interface DealProgressTrackerProps {
  period: string;
  team: string;
  searchQuery: string;
}

const DealProgressTracker: React.FC<DealProgressTrackerProps> = ({ period, team, searchQuery }) => {

  const [expanded] = useState<Record<number, boolean>>({});

  const [activeSort, setActiveSort] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Dialog state for stakeholder details
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<{
    name: string;
    role: string;
    lastContact: string;
    progress: number;
    engagement?: 'low' | 'medium' | 'high';
    sentiment?: 'negative' | 'neutral' | 'positive';
    influence?: 'decision-maker' | 'champion' | 'blocker' | 'influencer';
    contactType?: 'email' | 'phone' | 'video-call' | 'meeting';
    activity?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    notes?: string;
    interactions?: number;
    avatar?: string;
    company?: string;
  } | null>(null);

  // Deal details popup (Org Chart + placeholders)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [orgChartDialogOpen, setOrgChartDialogOpen] = useState(false);
  const [dealProgressDialogOpen, setDealProgressDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogMessage, setInfoDialogMessage] = useState<string>('');
  const [activitiesDialogOpen, setActivitiesDialogOpen] = useState(false);
  const [activitiesForDeal, setActivitiesForDeal] = useState<Array<{ contact: string; method: string; date: string; duration: string }>>([]);

  const openInfo = (msg: string) => {
    setInfoDialogMessage(msg);
    setInfoDialogOpen(true);
  };

  const buildActivities = (deal: typeof deals[number]) => {
    const methods = ['email', 'phone', 'video-call', 'meeting'];
    const items = (deal.stakeholderDetails ?? []).map((s, i) => ({
      contact: s.name,
      method: methods[i % methods.length],
      date: s.lastContact,
      duration: i % 2 === 0 ? '45 min' : '30 min',
    }));
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getMethodLabel = (m: string) => {
    switch (m) {
      case 'email': return 'Email';
      case 'phone': return 'Phone';
      case 'video-call': return 'Video Call';
      case 'meeting': return 'Meeting';
      default: return m;
    }
  };

  const getLatestActivity = (deal: typeof deals[number]) => {
    const items = buildActivities(deal);
    if (items.length > 0) {
      const a = items[0];
      return { summary: `${getMethodLabel(a.method)} with ${a.contact}` , date: a.date };
    }
    return { summary: deal.lastActivity, date: deal.nextStepDate };
  };
  // Selected deal info for dialog header
  const [selectedDealForDetails, setSelectedDealForDetails] = useState<{
    company: string;
    value: number;
    stakeholders: number;
  } | null>(null);

  // Sample deal data
  const deals = [
    {
      id: 1,
      company: 'TechCorp Solutions',
      type: 'Renewal',
      value: 250000,
      stage: 'Negotiation',
      progress: 75,
      owner: 'Sarah Johnson',
      nextStep: 'Contract review meeting',
      nextStepDate: '2025-01-15',
      blockers: ['Budget approval pending', 'Legal review required'],
      stakeholders: 4,
      lastActivity: '2 days ago',
      riskLevel: 'Medium',
      closeDate: '2025-01-30',
      probability: 85,
      stakeholderDetails: [
        { name: 'Alex Brown', role: 'VP Procurement', lastContact: '2025-01-08', progress: 80 },
        { name: 'Nina Patel', role: 'Legal Counsel', lastContact: '2025-01-06', progress: 60 },
        { name: 'Tom Lee', role: 'Finance Manager', lastContact: '2025-01-09', progress: 70 },
        { name: 'Emma Davis', role: 'Procurement Analyst', lastContact: '2025-01-07', progress: 35 },
      ]
    },
    {
      id: 2,
      company: 'Global Dynamics Inc',
      type: 'New Business',
      value: 180000,
      stage: 'Proposal',
      progress: 60,
      owner: 'Michael Chen',
      nextStep: 'Present final proposal',
      nextStepDate: '2025-01-12',
      blockers: ['Competitor evaluation'],
      stakeholders: 3,
      lastActivity: '1 day ago',
      riskLevel: 'High',
      closeDate: '2025-01-25',
      probability: 65,
      stakeholderDetails: [
        { name: 'Laura Smith', role: 'CTO', lastContact: '2025-01-05', progress: 50 },
        { name: 'Peter Wu', role: 'Engineering Lead', lastContact: '2025-01-07', progress: 45 },
      ]
    },
    {
      id: 3,
      company: 'Innovation Labs',
      type: 'Expansion',
      value: 420000,
      stage: 'Discovery',
      progress: 40,
      owner: 'Emily Rodriguez',
      nextStep: 'Technical deep dive',
      nextStepDate: '2025-01-18',
      blockers: [],
      stakeholders: 6,
      lastActivity: '5 hours ago',
      riskLevel: 'Low',
      closeDate: '2025-02-15',
      probability: 70,
      stakeholderDetails: [
        { name: 'Mark Allen', role: 'Product Owner', lastContact: '2025-01-09', progress: 40 },
        { name: 'Jenny Kim', role: 'Operations Manager', lastContact: '2025-01-10', progress: 35 },
        { name: 'Carlos Diaz', role: 'IT Director', lastContact: '2025-01-08', progress: 50 },
      ]
    },
    {
      id: 4,
      company: 'Enterprise Systems',
      type: 'Cross-sell',
      value: 680000,
      stage: 'Qualified',
      progress: 25,
      owner: 'David Kim',
      nextStep: 'Requirements gathering',
      nextStepDate: '2025-01-20',
      blockers: ['Key stakeholder unavailable'],
      stakeholders: 5,
      lastActivity: '3 days ago',
      riskLevel: 'High',
      closeDate: '2025-03-01',
      probability: 45,
      stakeholderDetails: [
        { name: 'Priya Singh', role: 'Head of Ops', lastContact: '2025-01-03', progress: 30 },
        { name: 'Ethan Clark', role: 'CFO', lastContact: '2023-12-29', progress: 20 },
        { name: 'Sophie Martin', role: 'Project Lead', lastContact: '2025-01-02', progress: 25 },
      ]
    },
    {
      id: 5,
      company: 'FinServe Group',
      type: 'New Business',
      value: 310000,
      stage: 'Proposal',
      progress: 55,
      owner: 'Olivia Park',
      nextStep: 'Budget alignment call',
      nextStepDate: '2025-01-14',
      blockers: ['Awaiting CFO feedback'],
      stakeholders: 4,
      lastActivity: '8 hours ago',
      riskLevel: 'Medium',
      closeDate: '2025-02-10',
      probability: 62,
      stakeholderDetails: [
        { name: 'Jason Moore', role: 'CFO', lastContact: '2025-01-07', progress: 55 },
        { name: 'Angela Ruiz', role: 'Compliance Lead', lastContact: '2025-01-06', progress: 50 },
      ]
    },
    {
      id: 6,
      company: 'DataWorks Co.',
      type: 'Expansion',
      value: 220000,
      stage: 'Negotiation',
      progress: 80,
      owner: 'Noah Lee',
      nextStep: 'Finalize terms',
      nextStepDate: '2025-01-17',
      blockers: [],
      stakeholders: 5,
      lastActivity: '1 day ago',
      riskLevel: 'Low',
      closeDate: '2025-01-28',
      probability: 88,
      stakeholderDetails: [
        { name: 'Grace Huang', role: 'VP Engineering', lastContact: '2025-01-09', progress: 85 },
        { name: 'Robert King', role: 'Procurement Lead', lastContact: '2025-01-08', progress: 70 },
        { name: 'Mia Lopez', role: 'Finance Analyst', lastContact: '2025-01-09', progress: 75 },
      ]
    }
  ];

  // Selected full deal for details dialog tabs
  const [selectedDeal, setSelectedDeal] = useState<typeof deals[number] | null>(null);
  // Active tab in details dialog (controls footer visibility)
  const [activeDetailsTab, setActiveDetailsTab] = useState<'org-chart' | 'deal-progress' | 'stakeholder-sentiment'>('deal-progress');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format amount without currency symbol, used with dollar icon
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'Prospecting': 'pipeline-prospecting',
      'Discovery': 'pipeline-qualified',
      'Qualified': 'pipeline-qualified',
      'Proposal': 'pipeline-proposal', 
      'Negotiation': 'pipeline-negotiation',
      'Closed Won': 'pipeline-closed-won',
      'Closed Lost': 'pipeline-closed-lost'
    };
    return colors[stage as keyof typeof colors] || 'muted';
  };

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'destructive'
    };
    return colors[riskLevel as keyof typeof colors] || 'muted';
  };
  const getRiskClasses = (riskLevel: string) => {
    const key = riskLevel?.toLowerCase();
    switch (key) {
      case 'low':
        return { text: 'text-success', border: 'border-success' };
      case 'medium':
        return { text: 'text-warning', border: 'border-warning' };
      case 'high':
        return { text: 'text-destructive', border: 'border-destructive' };
      default:
        return { text: 'text-muted-foreground', border: 'border-muted' };
    }
  };

  const riskFromProbability = (p?: number) => {
    const v = typeof p === 'number' ? p : 50;
    return v >= 80 ? 'low' : v >= 50 ? 'medium' : 'high';
  };

  // Attention logic: mark stakeholders needing reachout (must be stale contact AND low progress)
  const needsReachout = (s: { lastContact: string; progress: number }) => {
    const daysSince = (dateStr: string) => {
      const d = new Date(dateStr);
      const now = new Date();
      const ms = now.getTime() - d.getTime();
      return Math.floor(ms / (1000 * 60 * 60 * 24));
    };
    const stale = daysSince(s.lastContact) > 14;
    const lowProgress = s.progress < 40;
    return stale && lowProgress;
  };

  const dealNeedsImmediateAttention = (deal: typeof deals[number]) => {
    return deal.stakeholderDetails?.some(s => needsReachout(s));
  };

  // Helper: UI icon/color utilities similar to Stakeholder tab
  const getContactIcon = (type?: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'video-call': return <Video className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSentimentIcon = (sent?: string) => {
    switch (sent) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getInfluenceIcon = (inf?: string) => {
    switch (inf) {
      case 'decision-maker': return <Crown className="h-4 w-4 text-warning" />;
      case 'champion': return <Heart className="h-4 w-4 text-success" />;
      case 'blocker': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEngagementColor = (lvl?: string) => {
    switch (lvl) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'destructive';
      default: return 'muted-foreground';
    }
  };

  const getStakeholderRiskColor = (lvl?: string) => {
    switch (lvl) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'muted-foreground';
    }
  };

  // Risk badge classes using literal Tailwind tokens to ensure hover styles compile
  const riskBadgeClasses = (lvl?: string) => {
    switch (lvl) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Enrich stakeholder with defaults to match Stakeholder tab fields
  const enrichStakeholder = (s: { name: string; role: string; lastContact: string; progress: number }) => {
    const reachout = needsReachout(s);
    const engagement: 'low' | 'medium' | 'high' = s.progress >= 70 ? 'high' : s.progress >= 50 ? 'medium' : 'low';
    const sentiment: 'negative' | 'neutral' | 'positive' = s.progress >= 70 ? 'positive' : s.progress >= 40 ? 'neutral' : 'negative';
    const influence: 'decision-maker' | 'champion' | 'blocker' | 'influencer' = /CFO|CTO|Director|VP/i.test(s.role) ? 'decision-maker' : s.progress >= 60 ? 'champion' : reachout ? 'blocker' : 'influencer';
    const riskLevel: 'low' | 'medium' | 'high' = reachout ? (s.progress < 30 ? 'high' : 'medium') : 'low';
    const interactions = Math.max(3, Math.floor(s.progress / 10));
    const contactType: 'email' | 'phone' | 'video-call' | 'meeting' = s.progress >= 60 ? 'meeting' : 'email';
    return {
      ...s,
      engagement,
      sentiment,
      influence,
      riskLevel,
      interactions,
      contactType,
      activity: s.progress >= 60 ? 'Reviewed proposal and provided feedback' : 'Awaiting response to outreach',
      notes: s.progress >= 60 ? 'Positive on solution fit; needs budget alignment' : 'Follow-up required to re-engage',
      avatar: '/api/placeholder/40/40',
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getConfidenceStyle = (p: number) => {
    if (p >= 80) return { cls: 'text-success', style: undefined as React.CSSProperties | undefined };
    if (p >= 50) return { cls: undefined, style: { color: '#FF8E1C' } as React.CSSProperties };
    return { cls: 'text-destructive', style: undefined as React.CSSProperties | undefined };
  };
  const getConfidenceIcon = (p: number) => {
    const s = getConfidenceStyle(p);
    return p >= 80
      ? <CheckCircle className={`h-4 w-4 ${s.cls ?? ''}`} style={s.style} />
      : p >= 50
        ? <TrendingUp className="h-4 w-4" style={s.style} />
        : <AlertTriangle className={`h-4 w-4 ${s.cls ?? ''}`} style={s.style} />;
  };
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'New Business': 'info',
      'Renewal': 'success',
      'Expansion': 'primary',
      'Cross-sell': 'primary'
    };
    return colors[type] || 'muted';
  };

  const getInfluenceLevel = (p: number) => (p >= 70 ? 'High' : p >= 40 ? 'Medium' : 'Low');
  const getInfluenceColor = (level: string) => {
    const colors: Record<string, string> = {
      High: 'success',
      Medium: 'warning',
      Low: 'muted',
    };
    return colors[level] || 'muted';
  };
  const getInfluenceClasses = (level: string) => {
    const key = level?.toLowerCase();
    switch (key) {
      case 'high':
        return { bg: 'bg-success/10', text: 'text-success' };
      case 'medium':
        return { bg: 'bg-warning/10', text: 'text-warning' };
      case 'low':
        return { bg: 'bg-muted/10', text: 'text-muted-foreground' };
      default:
        return { bg: 'bg-muted/10', text: 'text-muted-foreground' };
    }
  };
  const getEngagementIcon = (lvl?: 'low' | 'medium' | 'high') => {
    const label = lvl === 'high' ? 'High Engagement' : lvl === 'medium' ? 'Medium Engagement' : 'Low Engagement';
    const color = lvl === 'high' ? 'text-emerald-600' : lvl === 'medium' ? 'text-amber-600' : 'text-red-600';
    const Icon = lvl === 'low' ? ThumbsDown : ThumbsUp;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className={`h-4 w-4 ${color}`} />
        </TooltipTrigger>
        <TooltipContent className="bg-white">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-none border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold text-foreground">{deals.length}</p>
              </div>
              <div className="p-2">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-foreground">
                  {deals.filter(d => d.riskLevel === 'high').length}
                </p>
              </div>
              <div className="p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(deals.reduce((sum, deal) => sum + deal.progress, 0) / deals.length)}%
                </p>
              </div>
              <div className="p-2">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                </p>
              </div>
              <div className="p-2">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Progress Table */}
      <Card className="shadow-none border-0">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-3">
              <span>Deals Overview</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search deals..."
                defaultValue={searchQuery}
                className="w-[240px] bg-white"
              />
              <Button
                variant="outline"
                size="sm"
                className="bg-white rounded-lg border border-[#605BFF] text-[#605BFF] hover:bg-[#605BFF] hover:text-white h-9 w-28 justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white rounded-lg text-[#FF8E1C] border border-[#FF8E1C] hover:bg-[#FF8E1C] hover:text-white h-9 w-28 justify-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[380px] p-0 bg-white">
                  <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Filter size={18} className="text-[#FF8E1C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Filter Deals</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFilterOpen(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-800">Type</span>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="new-business">New Business</SelectItem>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                          <SelectItem value="cross-sell">Cross-sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-800">Stage</span>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="prospecting">Prospecting</SelectItem>
                          <SelectItem value="discovery">Discovery</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-800">Risk</span>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="low">low</SelectItem>
                          <SelectItem value="medium">medium</SelectItem>
                          <SelectItem value="high">high</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-800">Owner</span>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
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
                  <div className="px-4 py-3 border-t border-border/40 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">Clear All</Button>
                    <Button size="sm"  className="flex-1 px-4 py-2.5 text-sm font-medium bg-white border border-[#605BFF] text-[#605BFF] rounded-lg transition-all duration-200 hover:bg-[#605BFF] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">Apply Filter</Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-muted-foreground h-9 w-28 justify-center gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeSort ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate max-w-[5.5rem]">{`Sort: ${activeSort}`}</span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">{activeSort}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="truncate max-w-[5.5rem]">Sort</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem onClick={() => setActiveSort('')}>{activeSort === '' && <Check className="h-4 w-4 mr-2" />}Clear sort</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSort('Value ↓')}>{activeSort === 'Value ↓' && <Check className="h-4 w-4 mr-2" />}Value ↓</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSort('Value ↑')}>{activeSort === 'Value ↑' && <Check className="h-4 w-4 mr-2" />}Value ↑</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSort('Progress ↓')}>{activeSort === 'Progress ↓' && <Check className="h-4 w-4 mr-2" />}Progress ↓</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSort('Progress ↑')}>{activeSort === 'Progress ↑' && <Check className="h-4 w-4 mr-2" />}Progress ↑</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSort('Close Date ⭢ Soonest')}>{activeSort === 'Close Date ⭢ Soonest' && <Check className="h-4 w-4 mr-2" />}Close Date ⭢ Soonest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSort('Last Activity ⭢ Recent')}>{activeSort === 'Last Activity ⭢ Recent' && <Check className="h-4 w-4 mr-2" />}Last Activity ⭢ Recent</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSort('Risk ⭢ High First')}>{activeSort === 'Risk ⭢ High First' && <Check className="h-4 w-4 mr-2" />}Risk ⭢ High First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSort('Owner ⭢ A–Z')}>{activeSort === 'Owner ⭢ A–Z' && <Check className="h-4 w-4 mr-2" />}Owner ⭢ A–Z</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="space-y-4">
            {deals.map((deal) => (
              <div 
                key={deal.id}
                className={`rounded-lg p-4 transition-all duration-200 border border-border`}
              >
                
                {/* Deal Header */}

                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{deal.company}</h3>
                      {dealNeedsImmediateAttention(deal) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white ring-2 ring-red-300 shadow-md animate-pulse transform scale-[0.7] origin-center"
                              onClick={() => { setSelectedDeal(deal); setOrgChartDialogOpen(true); }}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">Immediate Action Required</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button className="group flex items-center gap-2 cursor-pointer rounded px-1 transition-colors hover:bg-muted/40" onClick={() => { setSelectedDeal(deal); setDealProgressDialogOpen(true); }}>
                      {getConfidenceIcon(deal.probability)}
                      <span className={`${getConfidenceStyle(deal.probability).cls ?? ''} group-hover:opacity-90`} style={getConfidenceStyle(deal.probability).style}>{deal.probability}%</span>
                      <span className="text-sm text-muted-foreground font-normal group-hover:text-primary">Win Rate</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatAmount(deal.value)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{deal.type}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {deal.owner}
                    </span>
                    <button
                      className="group flex items-center gap-1 px-1 rounded transition-colors hover:bg-muted/40 text-muted-foreground"
                      onClick={() => { setSelectedDeal(deal); setOrgChartDialogOpen(true); }}
                    >
                      <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="group-hover:text-primary">Stakeholders: {deal.stakeholders}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Close: {formatDate(deal.closeDate)}
                    </span>
                  </div>
                  <div>
                    <Badge className={`${riskBadgeClasses(riskFromProbability(deal.probability))} transition-colors cursor-default text-xs capitalize`}>
                      {riskFromProbability(deal.probability)} risk
                    </Badge>
                  </div>
                </div>

                

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <div className="group cursor-pointer" onClick={() => openInfo('Behavior simulation: A user should be taken to the recommended action points in meeting intelligence')}>
                      <h4 className="font-medium text-foreground mb-2">Next Step</h4>
                      <p className="text-sm text-muted-foreground group-hover:text-primary">{deal.nextStep} | {formatDate(deal.nextStepDate)}</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => { setActivitiesForDeal(buildActivities(deal)); setActivitiesDialogOpen(true); }}>
                      <h4 className="font-medium text-foreground mb-2">Last Activity</h4>
                      <p className="text-sm text-muted-foreground group-hover:text-primary">{getLatestActivity(deal).summary} | {formatDate(getLatestActivity(deal).date)}</p>
                    </div>
                  </div>
                    {deal.blockers.length > 0 && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">Key Blockers</h4>
                        <div className="space-y-1">
                          {deal.blockers.map((blocker, index) => {
                            const stakeholders = deal.stakeholderDetails ?? [];
                            const person = stakeholders.length > 0 ? stakeholders[index % stakeholders.length] : undefined;
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <button
                                  className="group flex items-center gap-2 cursor-pointer"
                                  onClick={() => openInfo('Behavior simulation: Navigate to Meeting Intelligence page/popup to show blockers')}
                                >
                                  <XCircle className="h-3 w-3 text-destructive" />
                                  <span className="text-sm text-muted-foreground group-hover:text-primary">{blocker}</span>
                                </button>
                                {person && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <button
                                      className="text-sm text-muted-foreground hover:text-primary underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStakeholder({ ...enrichStakeholder(person), company: deal.company });
                                        setStakeholderDialogOpen(true);
                                      }}
                                    >
                                      {person.name}
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Notes</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary" onClick={() => openInfo('Behavior simulation: Navigate to Meeting Intelligence page/popup to show notes')}>• Align budget for Q1 rollout</p>
                        <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary" onClick={() => openInfo('Behavior simulation: Navigate to Meeting Intelligence page/popup to show notes')}>• Legal review needs template updates</p>
                        <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary" onClick={() => openInfo('Behavior simulation: Navigate to Meeting Intelligence page/popup to show notes')}>• Schedule executive sponsor call next week</p>
                      </div>
                    </div>
                    {/*
                    <div className="md:col-span-3">
                      <h4 className="font-medium text-foreground mb-2">Stakeholder Progress</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {deal.stakeholderDetails?.map((s) => {
                          const level = getInfluenceLevel(s.progress);
                          const inf = getInfluenceClasses(level);
                          return (
                            <button
                              key={s.name}
                              className={`text-left p-3 rounded-md w-full bg-muted hover:bg-muted/80 border ${needsReachout(s) ? 'border-red-500/50' : 'border-transparent'} transition-colors`}
                              onClick={() => { setSelectedStakeholder({ ...enrichStakeholder(s), company: deal.company }); setStakeholderDialogOpen(true); }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{s.name}</p>
                                    {needsReachout(s) && (
                                      <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                        <AlertTriangle className="h-3 w-3 text-red-500" />
                                        Reach out immediately
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{s.role} • {deal.company}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">Last contact: {formatDate(s.lastContact)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getEngagementIcon(level.toLowerCase() as 'low' | 'medium' | 'high')}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stakeholder Detail Dialog */}
      <Dialog open={stakeholderDialogOpen} onOpenChange={setStakeholderDialogOpen}>
        <DialogContent>
          {selectedStakeholder && (
            <div className="space-y-4 pt-6">
              {/* Top alert absolutely positioned to share the same row with the close icon */}
              {needsReachout(selectedStakeholder) && (
                <div className="absolute top-4 left-4 right-12 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-600">Needs immediate reachout</span>
                  </div>
                </div>
              )}
              {/* Header mirrors Stakeholder card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedStakeholder.avatar} alt={selectedStakeholder.name} />
                      <AvatarFallback>{selectedStakeholder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="m-0 p-0">{selectedStakeholder.name}</DialogTitle>
                      <DialogDescription className="mt-0">{selectedStakeholder.role}{selectedStakeholder.company ? ` • ${selectedStakeholder.company}` : ''}</DialogDescription>
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                  {getInfluenceIcon(selectedStakeholder.influence)}
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedStakeholder.influence || 'influencer'}
                  </Badge>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1`}>
                    {getEngagementIcon(selectedStakeholder.engagement)}
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-sm font-medium capitalize">{selectedStakeholder.engagement}</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-1">
                    {getSentimentIcon(selectedStakeholder.sentiment)}
                  </div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p className="text-sm font-medium capitalize">{selectedStakeholder.sentiment}</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1">
                    <MessageSquare className="h-4 w-4 text-info" />
                  </div>
                  <p className="text-xs text-muted-foreground">Interactions</p>
                  <p className="text-sm font-medium">{selectedStakeholder.interactions}</p>
                </div>
              </div>

              {/* Last Contact and Risk */}

              
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {getContactIcon(selectedStakeholder.contactType)}
                    <span className="text-muted-foreground">Last contact:</span>
                    <span className="font-medium text-foreground">{formatDate(selectedStakeholder.lastContact)}</span>
                  </div>
                  <Badge className={`${riskBadgeClasses(selectedStakeholder.riskLevel)} transition-colors cursor-default text-xs capitalize`}>
                    {selectedStakeholder.riskLevel} risk
                  </Badge>
                </div>
              </div>

              {/* Activity & Notes */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recent activity:</p>
                <p className="text-sm font-medium text-foreground">{selectedStakeholder.activity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm text-foreground">{selectedStakeholder.notes}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

  <OrgChartPopup open={orgChartDialogOpen} onOpenChange={setOrgChartDialogOpen} period={period} team={team} searchQuery={searchQuery} company={selectedDeal?.company} />
  <DealProgressPopup open={dealProgressDialogOpen} onOpenChange={setDealProgressDialogOpen} deal={selectedDeal} />
  <InfoPopup open={infoDialogOpen} onOpenChange={setInfoDialogOpen} title="Info">
    <div className="text-sm text-muted-foreground">{infoDialogMessage}</div>
  </InfoPopup>

  <Dialog open={activitiesDialogOpen} onOpenChange={setActivitiesDialogOpen}>
    <DialogContent>
      <div className="space-y-2">
        {activitiesForDeal.map((a, idx) => (
          <button
            key={idx}
            className="w-full text-left p-2 rounded hover:bg-muted/40 flex items-center gap-5"
            onClick={() => openInfo('Behavior simulation: Navigate to Meeting Intelligence page/popup to show Meeting/Call summary')}
          >
            <div className="flex items-center gap-2">
              {getContactIcon(a.method)}
              <span className="text-sm font-medium text-foreground">{a.contact}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span>{a.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>

  {/* Deal Details Dialog with header/body/footer */}
  <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
    <DialogContent className="w-[96vw] max-w-6xl max-h-[80vh] p-0 sm:p-0 flex flex-col [&>button]:hidden">
      <Tabs
        value={activeDetailsTab}
        onValueChange={(v) =>
          setActiveDetailsTab(
            v as 'org-chart' | 'deal-progress' | 'stakeholder-sentiment'
          )
        }
        className="w-full flex flex-col flex-1 min-h-0"
      >
            {/* Header: title + tabs + close icon */}
            <div className="flex items-start justify-between px-4 pt-4 pb-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <DialogTitle className="m-0 p-0">{selectedDealForDetails?.company ?? 'Deal Details'}</DialogTitle>
                  {selectedDealForDetails && (
                    <span className="text-sm text-muted-foreground">• $ {formatAmount(selectedDealForDetails.value)} • {selectedDealForDetails.stakeholders} stakeholders</span>
                  )}
                </div>
                <TabsList className="w-fit rounded-lg bg-muted p-1 mt-2">
                  <TabsTrigger value="org-chart" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Org Chart</TabsTrigger>
                  <TabsTrigger value="deal-progress" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Deal Progress</TabsTrigger>
                  <TabsTrigger value="stakeholder-sentiment" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Stakeholder Sentiment</TabsTrigger>
                </TabsList>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 self-start">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>

            {/* Body: tabs content, scrollable area */}
            <div className="flex-1 min-h-0 overflow-y-auto pt-0 px-4 pb-4 sm:pt-0 sm:px-4 sm:pb-4">
              <TabsContent value="org-chart">
                <OrgChartMapping period={period} team={team} searchQuery={searchQuery} hideBuyingCommitteeAnalysis />
              </TabsContent>
              <TabsContent value="deal-progress">
                <DealProgressDetails deal={selectedDeal} />
              </TabsContent>
              <TabsContent value="stakeholder-sentiment">
                <StakeholderSentimentPanel deal={selectedDeal} />
              </TabsContent>
            </div>
          </Tabs>

      {/* Footer: Buying Committee Analysis content (only show on Org Chart) intentionally removed */}
    </DialogContent>
  </Dialog>
    </div>
  );
};

export default DealProgressTracker;
