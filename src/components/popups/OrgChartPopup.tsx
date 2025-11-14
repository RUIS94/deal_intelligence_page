import React, { useMemo, useState, useEffect, useRef } from 'react';
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StakeholderSentimentPanel from '@/components/dashboard/StakeholderSentimentPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Calendar, Users, Mail, Phone, Video, MessageSquare, TrendingUp, TrendingDown, Eye, Crown, Heart, AlertTriangle, X, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';

interface OrgChartPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: string;
  team: string;
  searchQuery: string;
  company?: string;
  value?: number;
  stakeholders?: number;
}

type PersonNode = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  company: string;
  lastContact: string;
  meetings: number;
  engagement: 'low' | 'medium' | 'high';
  sentiment: 'negative' | 'neutral' | 'positive';
  reportingTo: number | null;
  children: number[];
  influence?: 'decision-maker' | 'champion' | 'blocker' | 'influencer';
  contactType?: 'email' | 'phone' | 'video-call' | 'meeting';
  activity?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  notes?: string;
  interactions?: number;
};

const OrgChartPopup: React.FC<OrgChartPopupProps> = ({ open, onOpenChange, company, value, stakeholders }) => {
  const [selectedPerson, setSelectedPerson] = useState<PersonNode | null>(null);
  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'org-chart' | 'stakeholder-sentiment'>('org-chart');
  const [orgViewMode, setOrgViewMode] = useState<'hierarchy' | 'influence'>('hierarchy');

  const needsReachout = (n: PersonNode) => {
    const d = new Date(n.lastContact);
    const now = new Date();
    const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return days > 14 && n.engagement === 'low';
  };
  const [pendingScrollId, setPendingScrollId] = useState<number | null>(null);
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (activeTab === 'org-chart' && orgViewMode === 'hierarchy' && pendingScrollId) {
      const el = cardRefs.current[pendingScrollId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setPendingScrollId(null);
      }
    }
  }, [activeTab, orgViewMode, pendingScrollId]);

  const nodes: PersonNode[] = useMemo(() => ([
    { id: 1, name: 'Sarah Mitchell', role: 'CEO', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-11-01', meetings: 5, engagement: 'medium', sentiment: 'positive', reportingTo: null, children: [2,3], influence: 'decision-maker', contactType: 'meeting', activity: 'Exec sponsor alignment', riskLevel: 'medium', notes: 'Cost conscious', interactions: 12 },
    { id: 2, name: 'Jennifer Smith', role: 'CTO', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-10-29', meetings: 7, engagement: 'high', sentiment: 'positive', reportingTo: 1, children: [4,5], influence: 'decision-maker', contactType: 'video-call', activity: 'Technical validation', riskLevel: 'low', notes: 'Leads evaluation', interactions: 18 },
    { id: 3, name: 'Robert Johnson', role: 'CFO', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-10-25', meetings: 3, engagement: 'medium', sentiment: 'neutral', reportingTo: 1, children: [], influence: 'decision-maker', contactType: 'email', activity: 'Budget review', riskLevel: 'medium', notes: 'Budget approval required', interactions: 9 },
    { id: 4, name: 'Maria Garcia', role: 'VP Engineering', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-11-10', meetings: 6, engagement: 'high', sentiment: 'positive', reportingTo: 2, children: [6], influence: 'champion', contactType: 'phone', activity: 'Advocating solution', riskLevel: 'low', notes: 'Strong advocate', interactions: 14 },
    { id: 5, name: 'David Lee', role: 'IT Director', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-10-20', meetings: 2, engagement: 'low', sentiment: 'neutral', reportingTo: 2, children: [], influence: 'blocker', contactType: 'email', activity: 'Security concerns', riskLevel: 'high', notes: 'Needs convincing', interactions: 7 },
    { id: 6, name: 'Alex Chen', role: 'Senior Engineer', avatar: '/api/placeholder/40/40', company: company ?? 'TechCorp', lastContact: '2025-11-11', meetings: 4, engagement: 'high', sentiment: 'neutral', reportingTo: 4, children: [], influence: 'influencer', contactType: 'meeting', activity: 'Hands-on feedback', riskLevel: 'low', notes: 'Positive feedback', interactions: 11 },
  ]), [company]);

  const byId = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);
  const roots = useMemo(() => nodes.filter(n => n.reportingTo === null), [nodes]);
  const groupedByInfluence = useMemo(() => {
    const acc: Record<string, PersonNode[]> = {};
    nodes.forEach(n => {
      const key = n.influence || 'influencer';
      if (!acc[key]) acc[key] = [];
      acc[key].push(n);
    });
    return acc;
  }, [nodes]);
  const immediateReachoutCount = useMemo(() => {
    const now = new Date();
    return nodes.filter(n => {
      const d = new Date(n.lastContact);
      const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return days > 14 && n.engagement === 'low';
    }).length;
  }, [nodes]);

  const handleImmediateReachoutClick = () => {
    const target = nodes.find(n => needsReachout(n));
    if (!target) return;
    setActiveTab('org-chart');
    setOrgViewMode('hierarchy');
    setPendingScrollId(target.id);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const badgeColor = (type: 'engagement' | 'sentiment', value: string) => {
    if (type === 'engagement') {
      return value === 'high' ? 'success' : value === 'medium' ? 'warning' : 'muted';
    }
    return value === 'positive' ? 'success' : value === 'negative' ? 'destructive' : 'info';
  };

  const getEngagementIcon = (lvl?: 'low' | 'medium' | 'high') => {
    const label = lvl === 'high' ? 'High Engagement' : lvl === 'medium' ? 'Medium Engagement' : 'Low Engagement';
    const color = lvl === 'high' ? 'text-emerald-600' : lvl === 'medium' ? 'text-amber-600' : 'text-red-600';
    const Icon = lvl === 'low' ? ThumbsDown : ThumbsUp;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted/30 cursor-default">
            <Icon className={`h-4 w-4 ${color}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  };

  const getEngagementThumb = (lvl?: 'low' | 'medium' | 'high') => {
    const label = lvl === 'high' ? 'High Engagement' : lvl === 'medium' ? 'Medium Engagement' : 'Low Engagement';
    const color = lvl === 'high' ? 'text-emerald-600' : lvl === 'medium' ? 'text-amber-600' : 'text-red-600';
    const Icon = lvl === 'low' ? ThumbsDown : ThumbsUp;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted/30 cursor-default">
            <Icon className={`h-4 w-4 ${color}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">{label}</TooltipContent>
      </Tooltip>
    );
  };

  const getSentimentDot = (sent?: 'positive' | 'neutral' | 'negative') => {
    const label = sent === 'positive' ? 'Positive' : sent === 'neutral' ? 'Neutral' : 'Negative';
    const bg = sent === 'positive' ? 'bg-emerald-600' : sent === 'neutral' ? 'bg-amber-600' : 'bg-red-600';
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted/30 cursor-default">
            <span className={`w-3 h-3 rounded-full ${bg}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">{label}</TooltipContent>
      </Tooltip>
    );
  };

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

  const influenceLabel = (inf?: string) => (
    inf === 'decision-maker' ? 'Decision Maker' :
    inf === 'champion' ? 'Champion' :
    inf === 'blocker' ? 'Blocker' : 'Influencer'
  );

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

  const sentimentDealSample = {
    company: 'Sample Deal',
    stakeholderDetails: [
      { name: 'Jennifer Smith', role: 'CTO', lastContact: '2025-11-01', progress: 80 },
      { name: 'Robert Johnson', role: 'CFO', lastContact: '2025-10-25', progress: 55 },
      { name: 'Maria Garcia', role: 'VP Engineering', lastContact: '2025-11-10', progress: 72 },
      { name: 'David Lee', role: 'IT Director', lastContact: '2025-10-20', progress: 35 },
    ],
  };

  const PersonCard: React.FC<{ person: PersonNode }> = ({ person }) => (
    <button
      ref={(el) => { cardRefs.current[person.id] = el; }}
      onClick={() => { setSelectedPerson(person); setPersonDialogOpen(true); }}
      className="text-left"
    >
      <Card className="relative w-72 border border-border shadow-none hover:shadow-none transition-shadow overflow-visible">
        {(() => { const d = new Date(person.lastContact); const now = new Date(); const stale = Math.floor((now.getTime()-d.getTime())/(1000*60*60*24))>14; const low = person.engagement==='low'; return stale && low; })() && (
          <span className="absolute -top-2 -right-2 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white ring-2 ring-red-300 shadow-md animate-pulse">
                  <Phone className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white">Reach out immediately</TooltipContent>
            </Tooltip>
          </span>
        )}
        <CardContent className="p-3">
          <TooltipProvider delayDuration={200} skipDelayDuration={300}>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground leading-tight">{person.name}</h3>
                {person.influence && person.influence !== 'influencer' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted/30 cursor-default">
                        {getInfluenceIcon(person.influence)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">{influenceLabel(person.influence)}</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-tight">{person.role} • {person.company}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last Contact:</span>
            <span className="font-medium text-foreground">{formatDate(person.lastContact)}</span>
          </div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Meetings:</span>
            <span className="font-medium text-foreground">{person.meetings}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Engagement:</span>
            {getEngagementThumb(person.engagement)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Sentiment:</span>
            {getSentimentDot(person.sentiment)}
          </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </button>
  );

  const TreeNode: React.FC<{ person: PersonNode }> = ({ person }) => {
    const children = person.children.map(id => byId[id]).filter(Boolean);
    return (
      <div className="flex flex-col items-center">
        <PersonCard person={person} />
        {children.length > 0 && (
          <>
            <div className="h-6 w-px bg-border mt-2" />
            <div className="relative pt-4">
              <div className="absolute top-0 left-0 right-0 h-px bg-border" />
              <div className="flex justify-center gap-6">
                {children.map(child => (
                  <div key={child.id} className="flex flex-col items-center">
                    <div className="w-px h-4 bg-border" />
                    <TreeNode person={child} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const formatAmount = (v?: number) => {
    const n = typeof v === 'number' ? v : 0;
    return n.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-6xl max-h-[80vh] p-0 sm:p-0 flex flex-col [&>button]:hidden">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'org-chart' | 'stakeholder-sentiment')}
          className="w-full flex flex-col flex-1 min-h-0"
        >
          <div className="flex items-start justify-between px-4 pt-6 pb-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="m-0 p-0">{company ?? 'Deal Details'}</DialogTitle>
                <span className="text-sm text-muted-foreground">• $ 250,000 • {typeof stakeholders === 'number' ? stakeholders : nodes.length} stakeholders</span>
                {immediateReachoutCount > 0 && (
                  <button
                    onClick={handleImmediateReachoutClick}
                    className="flex items-center gap-2 ml-11 rounded px-2 py-1 hover:bg-red-50"
                  >
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white ring-2 ring-red-300">
                      <Phone className="h-3 w-3" />
                    </span>
                    <span className="text-xs font-semibold text-red-600">{immediateReachoutCount} {immediateReachoutCount === 1 ? 'stakeholder needs immediate reachout' : 'stakeholders need immediate reachout'}</span>
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <TabsList className="w-fit rounded-lg bg-muted p-1">
                  <TabsTrigger value="org-chart" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Org Chart</TabsTrigger>
                  <TabsTrigger value="stakeholder-sentiment" className="rounded-lg px-4 py-2 text-muted-foreground shadow-none data-[state=active]:!text-primary data-[state=active]:bg-white data-[state=active]:shadow-none">Stakeholder Sentiment</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3 mr-12">
                  {activeTab === 'org-chart' && (
                    <Select value={orgViewMode} onValueChange={(v) => setOrgViewMode(v as 'hierarchy' | 'influence')}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hierarchy">Hierarchy</SelectItem>
                        <SelectItem value="influence">By Influence</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                </div>
              </div>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 self-start">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pt-0 px-4 pb-4 sm:pt-0 sm:px-4 sm:pb-4">
            <TabsContent value="org-chart">
              

              {orgViewMode === 'hierarchy' ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-10">
                    {roots.map(root => (
                      <TreeNode key={root.id} person={root} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(groupedByInfluence).map(([inf, people]) => (
                    <Card key={inf} className="shadow-none border-0">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg capitalize">
                          {getInfluenceIcon(inf)}
                          {inf.replace('-', ' ')}
                        </CardTitle>
                        <DialogDescription>
                          {people.length} stakeholder{people.length !== 1 ? 's' : ''}
                        </DialogDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {people.map(p => (
                          <button
                            key={p.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 min-w-[200px] hover:bg-muted/30 text-left"
                            onClick={() => { setSelectedPerson(p); setPersonDialogOpen(true); }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={p.avatar} alt={p.name} />
                              <AvatarFallback>{p.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-foreground leading-tight">{p.name}</p>
                              <p className="text-xs text-muted-foreground leading-tight">{p.role}</p>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Dialog open={personDialogOpen} onOpenChange={setPersonDialogOpen}>
                <DialogContent>
                  {selectedPerson && (
                    <div className="space-y-4 pt-6">
                      {(() => { const stale = (() => { const d = new Date(selectedPerson.lastContact); const now = new Date(); return Math.floor((now.getTime()-d.getTime())/(1000*60*60*24)); })(); return stale>14 && selectedPerson.engagement==='low'; })() && (
                        <div className="absolute top-4 left-4 right-12 flex items-center justify-between pointer-events-none">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-600">Needs immediate reachout</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedPerson.avatar} alt={selectedPerson.name} />
                            <AvatarFallback>{selectedPerson.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <DialogTitle className="m-0 p-0">{selectedPerson.name}</DialogTitle>
                            <DialogDescription className="mt-0">{selectedPerson.role} • {selectedPerson.company}</DialogDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getInfluenceIcon(selectedPerson.influence)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {selectedPerson.influence || 'influencer'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1`}>
                            {getEngagementIcon(selectedPerson.engagement)}
                          </div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-sm font-medium capitalize">{selectedPerson.engagement}</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1">
                            {getSentimentDot(selectedPerson.sentiment)}
                          </div>
                          <p className="text-xs text-muted-foreground">Sentiment</p>
                          <p className="text-sm font-medium capitalize">{selectedPerson.sentiment}</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1">
                            <MessageSquare className="h-4 w-4 text-info" />
                          </div>
                          <p className="text-xs text-muted-foreground">Meetings</p>
                          <p className="text-sm font-medium">{selectedPerson.interactions}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            {getContactIcon(selectedPerson.contactType)}
                            <span className="text-muted-foreground">Last contact:</span>
                            <span className="font-medium text-foreground">{formatDate(selectedPerson.lastContact)}</span>
                          </div>
                          <Badge className={`${riskBadgeClasses(selectedPerson.riskLevel)} transition-colors cursor-default text-xs capitalize`}>
                            {selectedPerson.riskLevel} risk
                          </Badge>
                        </div>
                      </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Recent activity:</p>
                <p className="text-sm font-medium text-foreground">{selectedPerson.activity}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Notes:</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted/40">
                        <Plus className="h-4 w-4 text-[#605BFF]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">Add Notes</TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-foreground">{selectedPerson.notes}</p>
              </div>

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
            </TabsContent>

            <TabsContent value="stakeholder-sentiment">
              <StakeholderSentimentPanel deal={sentimentDealSample} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default OrgChartPopup;