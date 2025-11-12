import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail,
  Phone,
  Video,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  Activity,
  Heart,
  Zap,
  Eye
} from 'lucide-react';

interface StakeholderInsightsProps {
  period: string;
  team: string;
  searchQuery: string;
}

const StakeholderInsights: React.FC<StakeholderInsightsProps> = ({ period, team, searchQuery }) => {
  const [selectedDeal, setSelectedDeal] = useState('techcorp');

  // Sample stakeholder data organized by deal
  const stakeholderData = {
    techcorp: {
      dealName: 'TechCorp Solutions',
      value: 250000,
      stakeholders: [
        {
          id: 1,
          name: 'Jennifer Smith',
          role: 'CTO',
          avatar: '/api/placeholder/40/40',
          engagement: 'high',
          sentiment: 'positive',
          influence: 'decision-maker',
          lastContact: '2024-01-10',
          contactType: 'video-call',
          activity: 'Reviewed technical proposal',
          riskLevel: 'low',
          notes: 'Very interested in integration capabilities',
          interactions: 12
        },
        {
          id: 2,
          name: 'Robert Johnson',
          role: 'CFO',
          avatar: '/api/placeholder/40/40',
          engagement: 'medium',
          sentiment: 'neutral',
          influence: 'decision-maker',
          lastContact: '2024-01-08',
          contactType: 'email',
          activity: 'Requested pricing breakdown',
          riskLevel: 'medium',
          notes: 'Budget concerns, needs ROI justification',
          interactions: 6
        },
        {
          id: 3,
          name: 'Maria Garcia',
          role: 'VP Engineering',
          avatar: '/api/placeholder/40/40',
          engagement: 'high',
          sentiment: 'positive',
          influence: 'champion',
          lastContact: '2024-01-11',
          contactType: 'meeting',
          activity: 'Demo feedback session',
          riskLevel: 'low',
          notes: 'Strong advocate, loves the technical features',
          interactions: 15
        },
        {
          id: 4,
          name: 'David Lee',
          role: 'IT Director',
          avatar: '/api/placeholder/40/40',
          engagement: 'low',
          sentiment: 'negative',
          influence: 'blocker',
          lastContact: '2024-01-05',
          contactType: 'phone',
          activity: 'Raised security concerns',
          riskLevel: 'high',
          notes: 'Skeptical about cloud migration',
          interactions: 3
        }
      ]
    }
  };

  const getEngagementColor = (level: string) => {
    const colors = {
      'high': 'engagement-high',
      'medium': 'engagement-medium', 
      'low': 'engagement-low'
    };
    return colors[level as keyof typeof colors] || 'muted';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-warning" />;
    }
  };

  const getInfluenceIcon = (influence: string) => {
    switch (influence) {
      case 'decision-maker': return <Users className="h-4 w-4 text-primary" />;
      case 'champion': return <Heart className="h-4 w-4 text-success" />;
      case 'blocker': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'video-call': return <Video className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    const colors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'destructive'
    };
    return colors[level as keyof typeof colors] || 'muted';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const currentDeal = stakeholderData[selectedDeal as keyof typeof stakeholderData];

  return (
    <div className="space-y-6">
      {/* Deal Selection and Summary */}

      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stakeholder Engagement Overview
          </CardTitle>
          <CardDescription>
            Monitor stakeholder sentiment, engagement levels, and communication patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{currentDeal.dealName}</h3>
              <p className="text-muted-foreground">
                ${currentDeal.value.toLocaleString()} • {currentDeal.stakeholders.length} stakeholders
              </p>
            </div>
            <Button variant="outline" size="sm">
              Switch Deal
            </Button>
          </div>
        </CardContent>

      </Card>

      {/* Stakeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentDeal.stakeholders.map((stakeholder) => (

          <Card key={stakeholder.id} className="border border-border shadow-none hover:shadow-none transition-shadow">
            <CardContent className="p-6">
              {/* Stakeholder Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={stakeholder.avatar} alt={stakeholder.name} />
                    <AvatarFallback>{stakeholder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{stakeholder.name}</h3>
                    <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getInfluenceIcon(stakeholder.influence)}
                  <Badge variant="outline" className="text-xs">
                    {stakeholder.influence}
                  </Badge>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full bg-${getEngagementColor(stakeholder.engagement)}/20 flex items-center justify-center mx-auto mb-1`}>
                    <Zap className={`h-4 w-4 text-${getEngagementColor(stakeholder.engagement)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-sm font-medium capitalize">{stakeholder.engagement}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-1">
                    {getSentimentIcon(stakeholder.sentiment)}
                  </div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p className="text-sm font-medium capitalize">{stakeholder.sentiment}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center mx-auto mb-1">
                    <MessageSquare className="h-4 w-4 text-info" />
                  </div>
                  <p className="text-xs text-muted-foreground">Interactions</p>
                  <p className="text-sm font-medium">{stakeholder.interactions}</p>
                </div>
              </div>

              {/* Last Contact */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {getContactIcon(stakeholder.contactType)}
                    <span className="text-muted-foreground">Last contact:</span>
                    <span className="font-medium text-foreground">{formatDate(stakeholder.lastContact)}</span>
                  </div>
                  <Badge className={`bg-${getRiskColor(stakeholder.riskLevel)}/10 text-${getRiskColor(stakeholder.riskLevel)} border-${getRiskColor(stakeholder.riskLevel)}/20 text-xs`}>
                    {stakeholder.riskLevel} risk
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recent activity:</p>
                  <p className="text-sm font-medium text-foreground">{stakeholder.activity}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm text-foreground">{stakeholder.notes}</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* At-Risk Stakeholders Alert */}
<Card className="shadow-none border-0 border-l-4 border-l-warning">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Attention Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {currentDeal.stakeholders.filter(s => s.riskLevel === 'high').length} stakeholder(s) need immediate attention
              </p>
              <div className="space-y-2">
                {currentDeal.stakeholders
                  .filter(s => s.riskLevel === 'high')
                  .map(stakeholder => (
                    <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stakeholder.avatar} alt={stakeholder.name} />
                          <AvatarFallback>{stakeholder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{stakeholder.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last contact: {formatDate(stakeholder.lastContact)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Reach Out
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderInsights;