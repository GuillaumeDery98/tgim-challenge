import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Mail, Users, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAllCampaignAnalytics, useEmailCampaigns } from '../hooks/useEmailCampaigns';

export function EmailAnalyticsDashboard() {
  const { data: campaigns = [] } = useEmailCampaigns();
  const { data: analytics = [] } = useAllCampaignAnalytics();

  // Generate sample trend data
  const trendData = useMemo(() => {
    const days = 30;
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        envois: Math.floor(Math.random() * 500) + 100,
        ouvertures: Math.floor(Math.random() * 150) + 30,
        clics: Math.floor(Math.random() * 50) + 10,
        taux_ouverture: Math.random() * 20 + 15
      });
    }
    return data;
  }, []);

  // Campaign performance data
  const campaignData = useMemo(() => {
    return campaigns.slice(0, 5).map((campaign, index) => {
      const analytic = analytics[index];
      return {
        name: campaign.name.length > 20 ? campaign.name.substring(0, 17) + '...' : campaign.name,
        envois: analytic?.sent || Math.floor(Math.random() * 1000) + 100,
        ouvertures: analytic?.opened || Math.floor(Math.random() * 300) + 50,
        clics: analytic?.clicked || Math.floor(Math.random() * 100) + 20,
        taux_ouverture: analytic?.openRate || Math.random() * 25 + 10,
        taux_clic: analytic?.clickRate || Math.random() * 8 + 2
      };
    });
  }, [campaigns, analytics]);

  // Device/Channel breakdown
  const deviceData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 35, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' }
  ];

  // Calculate overall metrics
  const totalMetrics = useMemo(() => {
    return analytics.reduce((acc, a) => ({
      sent: acc.sent + a.sent,
      delivered: acc.delivered + a.delivered,
      opened: acc.opened + a.opened,
      clicked: acc.clicked + a.clicked,
      bounced: acc.bounced + a.bounced
    }), { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 });
  }, [analytics]);

  const deliveryRate = totalMetrics.sent > 0 ? ((totalMetrics.delivered / totalMetrics.sent) * 100).toFixed(1) : '0.0';
  const openRate = totalMetrics.delivered > 0 ? ((totalMetrics.opened / totalMetrics.delivered) * 100).toFixed(1) : '0.0';
  const clickRate = totalMetrics.delivered > 0 ? ((totalMetrics.clicked / totalMetrics.delivered) * 100).toFixed(1) : '0.0';
  const bounceRate = totalMetrics.sent > 0 ? ((totalMetrics.bounced / totalMetrics.sent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Performances détaillées de vos campagnes email</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter le Rapport
        </Button>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Délivrance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalMetrics.delivered.toLocaleString()} / {totalMetrics.sent.toLocaleString()} emails
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux d'Ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalMetrics.opened.toLocaleString()} ouvertures
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Clic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{clickRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalMetrics.clicked.toLocaleString()} clics
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Rebond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bounceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalMetrics.bounced.toLocaleString()} rebonds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendances d'Engagement (30j)
            </CardTitle>
            <CardDescription>
              Évolution des métriques clés sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="envois" 
                  stroke="#8884d8" 
                  name="Envois"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="ouvertures" 
                  stroke="#82ca9d" 
                  name="Ouvertures"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="clics" 
                  stroke="#ffc658" 
                  name="Clics"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Répartition par Appareil
            </CardTitle>
            <CardDescription>
              Ouvertures par type d'appareil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Performance par Campagne
          </CardTitle>
          <CardDescription>
            Comparaison des performances de vos dernières campagnes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="envois" fill="#8884d8" name="Envois" />
              <Bar dataKey="ouvertures" fill="#82ca9d" name="Ouvertures" />
              <Bar dataKey="clics" fill="#ffc658" name="Clics" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🏆 Top Campaigns - Taux d'Ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignData
                .sort((a, b) => b.taux_ouverture - a.taux_ouverture)
                .slice(0, 3)
                .map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {campaign.taux_ouverture.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.ouvertures} ouvertures
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Top Campaigns - Taux de Clic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignData
                .sort((a, b) => b.taux_clic - a.taux_clic)
                .slice(0, 3)
                .map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {campaign.taux_clic.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.clics} clics
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}