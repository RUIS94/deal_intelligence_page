import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Crown,
  Heart,
  AlertTriangle,
  Eye,
  ArrowDown,
  ArrowRight,
  Building,
  UserCheck,
  MessageSquare,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

interface OrgChartMappingProps {
  period: string;
  team: string;
  searchQuery: string;
  hideBuyingCommitteeAnalysis?: boolean;
}

const OrgChartMapping: React.FC<OrgChartMappingProps> = ({ period, team, searchQuery, hideBuyingCommitteeAnalysis }) => {
  const [selectedDeal, setSelectedDeal] = useState('techcorp');
  const [viewMode, setViewMode] = useState('hierarchy');

  // Sample organizational data
  const orgData = {
    techcorp: {
      dealName: 'TechCorp Solutions',
      value: 250000,
      hierarchy: [
        {
          id: 1,
          name: 'Sarah Mitchell',
          role: 'CEO',
          avatar: '/api/placeholder/40/40',
          level: 1,
          influence: 'decision-maker',
          engagement: 'medium',
          buyingRole: 'executive-sponsor',
          notes: 'Final approver, cost-conscious',
          reportingTo: null,
          children: [2, 3]
        },
        {
          id: 2,
          name: 'Jennifer Smith',
          role: 'CTO',
          avatar: '/api/placeholder/40/40',
          level: 2,
          influence: 'decision-maker',
          engagement: 'high',
          buyingRole: 'technical-buyer',
          notes: 'Technical evaluation lead',
          reportingTo: 1,
          children: [4, 5]
        },
        {
          id: 3,
          name: 'Robert Johnson',
          role: 'CFO',
          avatar: '/api/placeholder/40/40',
          level: 2,
          influence: 'decision-maker',
          engagement: 'medium',
          buyingRole: 'financial-buyer',
          notes: 'Budget approval required',
          reportingTo: 1,
          children: []
        },
        {
          id: 4,
          name: 'Maria Garcia',
          role: 'VP Engineering',
          avatar: '/api/placeholder/40/40',
          level: 3,
          influence: 'champion',
          engagement: 'high',
          buyingRole: 'champion',
          notes: 'Strong advocate for solution',
          reportingTo: 2,
          children: [6]
        },
        {
          id: 5,
          name: 'David Lee',
          role: 'IT Director',
          avatar: '/api/placeholder/40/40',
          level: 3,
          influence: 'blocker',
          engagement: 'low',
          buyingRole: 'technical-buyer',
          notes: 'Security concerns, needs convincing',
          reportingTo: 2,
          children: []
        },
        {
          id: 6,
          name: 'Alex Chen',
          role: 'Senior Engineer',
          avatar: '/api/placeholder/40/40',
          level: 4,
          influence: 'influencer',
          engagement: 'high',
          buyingRole: 'end-user',
          notes: 'Day-to-day user, positive feedback',
          reportingTo: 4,
          children: []
        }
      ]
    }
  };

  const getInfluenceIcon = (influence: string) => {
    switch (influence) {
      case 'decision-maker': return <Crown className="h-4 w-4 text-warning" />;
      case 'champion': return <Heart className="h-4 w-4 text-success" />;
      case 'blocker': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'influencer': return <Users className="h-4 w-4 text-info" />;
      default: return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getInfluenceColor = (influence: string) => {
    const colors = {
      'decision-maker': 'warning',
      'champion': 'success',
      'blocker': 'destructive',
      'influencer': 'info'
    };
    return colors[influence as keyof typeof colors] || 'muted';
  };

  const getEngagementColor = (engagement: string) => {
    const colors = {
      'high': 'success',
      'medium': 'warning',
      'low': 'muted'
    };
    return colors[engagement as keyof typeof colors] || 'muted';
  };

  const getBuyingRoleColor = (role: string) => {
    const colors = {
      'executive-sponsor': 'primary',
      'technical-buyer': 'info',
      'financial-buyer': 'warning',
      'champion': 'success',
      'end-user': 'secondary'
    };
    return colors[role as keyof typeof colors] || 'muted';
  };

  const currentDeal = orgData[selectedDeal as keyof typeof orgData];

  const renderHierarchyView = () => {
    const getPersonsByLevel = (level: number) => {
      return currentDeal.hierarchy.filter(person => person.level === level);
    };

    const maxLevel = Math.max(...currentDeal.hierarchy.map(p => p.level));

    return (
      <div className="space-y-6">
        {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => (
          <div key={level}>
            {level > 1 && (
              <div className="flex justify-center mb-4">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {getPersonsByLevel(level).map(person => (
                <StakeholderCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderInfluenceView = () => {
    const groupedByInfluence = currentDeal.hierarchy.reduce((acc, person) => {
      if (!acc[person.influence]) acc[person.influence] = [];
      acc[person.influence].push(person);
      return acc;
    }, {} as Record<string, typeof currentDeal.hierarchy>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedByInfluence).map(([influence, people]) => (
          <Card key={influence} className="shadow-none border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg capitalize">
                {getInfluenceIcon(influence)}
                {influence.replace('-', ' ')}
              </CardTitle>
              <CardDescription>
                {people.length} stakeholder{people.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {people.map(person => (
                <div key={person.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 min-w-[200px]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-foreground leading-tight">{person.name}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{person.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const StakeholderCard = ({ person }: { person: typeof currentDeal.hierarchy[0] }) => (
    <Card className="w-72 border border-border shadow-none hover:shadow-none transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={person.avatar} alt={person.name} />
            <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">{person.name}</h3>
            <p className="text-xs text-muted-foreground leading-tight">{person.role}</p>
          </div>
        </div>

        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Influence:</span>
            <Badge className={`bg-${getInfluenceColor(person.influence)}/10 text-${getInfluenceColor(person.influence)} border-${getInfluenceColor(person.influence)}/20 text-xs hover:bg-transparent`}>{person.influence}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Engagement:</span>
            <Badge className={`bg-${getEngagementColor(person.engagement)}/10 text-${getEngagementColor(person.engagement)} border-${getEngagementColor(person.engagement)}/20 text-xs hover:bg-transparent`}>{person.engagement}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Role:</span>
            <Badge className={`bg-${getBuyingRoleColor(person.buyingRole)}/10 text-${getBuyingRoleColor(person.buyingRole)} border-${getBuyingRoleColor(person.buyingRole)}/20 text-xs hover:bg-transparent`}>{person.buyingRole.replace('-', ' ')}</Badge>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1 leading-tight">Notes:</p>
          <p className="text-xs text-foreground leading-tight">{person.notes}</p>
        </div>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="flex-1 h-7">
            <Mail className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-7">
            <Phone className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-7">
            <MessageSquare className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="shadow-none border-0 bg-background">
        <CardHeader className="sticky top-0 z-30 bg-background py-1 sm:py-2">
          <div className="flex items-center justify-between">
            {/* Indicators on the left */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Crown className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {currentDeal.hierarchy.filter(p => p.influence === 'decision-maker').length} Decision Makers
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">
                  {currentDeal.hierarchy.filter(p => p.influence === 'champion').length} Champions
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">
                  {currentDeal.hierarchy.filter(p => p.influence === 'blocker').length} Blockers
                </span>
              </div>
            </div>
            {/* View switcher on the right */}
            <div className="flex gap-3">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hierarchy">Hierarchy</SelectItem>
                  <SelectItem value="influence">By Influence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>


      {/* Organizational Chart */}
      <Card className="shadow-none border-0">
        <CardContent className="p-6">
          {viewMode === 'hierarchy' ? renderHierarchyView() : renderInfluenceView()}
        </CardContent>
      </Card>

      {/* Buying Committee Analysis (temporarily removed when Org Chart is active) */}
      {/**
       {!hideBuyingCommitteeAnalysis && (
        <Card className="shadow-none border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Buying Committee Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {currentDeal.hierarchy.filter(p => p.influence === 'decision-maker').length}
                </div>
                <p className="text-sm text-muted-foreground">Decision Makers Engaged</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs hover:bg-transparent">
                    Required: 2-3
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {Math.round(currentDeal.hierarchy.filter(p => p.engagement === 'high').length / currentDeal.hierarchy.length * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">High Engagement Rate</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs hover:bg-transparent">
                    Target: &gt;70%
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {currentDeal.hierarchy.filter(p => p.influence === 'champion').length}
                </div>
                <p className="text-sm text-muted-foreground">Internal Champions</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs hover:bg-transparent">
                    Minimum: 1
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      **/}
    </div>
  );
};

export default OrgChartMapping;