import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Activity, 
  Users, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  Menu,
  X,
  Bell,
  User,
  DollarSign
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

type HealthStatus = 'At Risk' | 'On Track' | 'Off Track' | 'Completed';
type WSRStatus = 'Red' | 'Amber' | 'Green';
type RiskLevel = 'Low' | 'Medium' | 'High';
type ComplianceStatus = 'Fully Compliant' | 'Moderately Compliant' | 'Non-Compliant';
type UtilizationStatus = 'Overloaded' | 'Optimal' | 'Underutilized';

interface Project {
  id: string;
  name: string;
  pmId: string;
  pmName: string;
  health: HealthStatus;
  utilization: number; // percentage
  wsrStatus: WSRStatus;
  wsrDelayDays: number;
  auditScore: number;
  lastAuditDate: string;
  riskLevel: RiskLevel;
  sowExpirationDate?: string; // SOW expiration date
  resourceReleaseDate?: string; // Resource release date
  resourceCount?: number; // Number of resources being released
  billingRatio?: number; // Billing ratio percentage
  teamSize?: number; // Total team size
  billableHours?: number; // Billable hours
  totalHours?: number; // Total hours
  nonBillableHours?: number; // Non-billable hours
}

interface PM {
  id: string;
  name: string;
  avatar: string;
}

// --- Mock Data ---

const PMS: PM[] = [
  { id: 'pm1', name: 'Sarah Jenkins', avatar: 'SJ' },
  { id: 'pm2', name: 'Michael Chen', avatar: 'MC' },
  { id: 'pm3', name: 'David Ross', avatar: 'DR' },
  { id: 'pm4', name: 'Emily White', avatar: 'EW' },
];

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Alpha Migration', pmId: 'pm1', pmName: 'Sarah Jenkins', health: 'At Risk', utilization: 85, wsrStatus: 'Red', wsrDelayDays: 0, auditScore: 92, lastAuditDate: '2023-10-15', riskLevel: 'Low', sowExpirationDate: '2023-11-30', resourceReleaseDate: '2023-11-15', resourceCount: 3, billingRatio: 75 },
  { id: 'p2', name: 'Beta E-com Revamp', pmId: 'pm1', pmName: 'Sarah Jenkins', health: 'On Track', utilization: 95, wsrStatus: 'Amber', wsrDelayDays: 0, auditScore: 84, lastAuditDate: '2023-10-10', riskLevel: 'Medium', sowExpirationDate: '2024-01-15', resourceReleaseDate: '2023-12-20', resourceCount: 2, billingRatio: 85 },
  { id: 'p3', name: 'Gamma Cloud Native', pmId: 'pm2', pmName: 'Michael Chen', health: 'Completed', utilization: 115, wsrStatus: 'Amber', wsrDelayDays: 3, auditScore: 75, lastAuditDate: '2023-09-28', riskLevel: 'High', sowExpirationDate: '2023-11-10', resourceReleaseDate: '2023-11-05', resourceCount: 5, billingRatio: 60, teamSize: 8, billableHours: 742, totalHours: 1280, nonBillableHours: 538 },
  { id: 'p4', name: 'Delta Security Fix', pmId: 'pm2', pmName: 'Michael Chen', health: 'Off Track', utilization: 70, wsrStatus: 'Red', wsrDelayDays: 0, auditScore: 95, lastAuditDate: '2023-10-20', riskLevel: 'Low', sowExpirationDate: '2024-02-28', resourceReleaseDate: '2024-01-10', resourceCount: 1, billingRatio: 90 },
  { id: 'p5', name: 'Epsilon Analytics', pmId: 'pm3', pmName: 'David Ross', health: 'On Track', utilization: 88, wsrStatus: 'Red', wsrDelayDays: 0, auditScore: 91, lastAuditDate: '2023-10-18', riskLevel: 'Low', sowExpirationDate: '2023-12-31', resourceReleaseDate: '2023-12-15', resourceCount: 4, billingRatio: 72, teamSize: 9, billableHours: 1036, totalHours: 1440, nonBillableHours: 404 },
  { id: 'p6', name: 'Zeta Mobile App', pmId: 'pm3', pmName: 'David Ross', health: 'At Risk', utilization: 120, wsrStatus: 'Amber', wsrDelayDays: 8, auditScore: 65, lastAuditDate: '2023-09-15', riskLevel: 'High', sowExpirationDate: '2023-11-20', resourceReleaseDate: '2023-11-12', resourceCount: 5, billingRatio: 55, teamSize: 10, billableHours: 880, totalHours: 1600, nonBillableHours: 720 },
  { id: 'p7', name: 'Theta CRM Integration', pmId: 'pm4', pmName: 'Emily White', health: 'At Risk', utilization: 105, wsrStatus: 'Red', wsrDelayDays: 0, auditScore: 88, lastAuditDate: '2023-10-12', riskLevel: 'Medium', sowExpirationDate: '2024-03-15', resourceReleaseDate: '2024-01-25', resourceCount: 2, billingRatio: 70, teamSize: 12, billableHours: 1190, totalHours: 1920, nonBillableHours: 730 },
  { id: 'p8', name: 'Iota Payment Gateway', pmId: 'pm4', pmName: 'Emily White', health: 'At Risk', utilization: 80, wsrStatus: 'Green', wsrDelayDays: 0, auditScore: 94, lastAuditDate: '2023-10-22', riskLevel: 'Low', sowExpirationDate: '2024-04-30', resourceReleaseDate: '2024-02-10', resourceCount: 1, billingRatio: 92 },
  { id: 'p9', name: 'Kappa AI Pilot', pmId: 'pm1', pmName: 'Sarah Jenkins', health: 'On Track', utilization: 92, wsrStatus: 'Amber', wsrDelayDays: 2, auditScore: 82, lastAuditDate: '2023-10-05', riskLevel: 'Medium', sowExpirationDate: '2023-12-15', resourceReleaseDate: '2023-11-28', resourceCount: 3, billingRatio: 78 },
  { id: 'p10', name: 'Lambda Legacy', pmId: 'pm2', pmName: 'Michael Chen', health: 'At Risk', utilization: 60, wsrStatus: 'Red', wsrDelayDays: 0, auditScore: 96, lastAuditDate: '2023-10-25', riskLevel: 'Low', sowExpirationDate: '2024-05-20', resourceReleaseDate: '2024-02-28', resourceCount: 2, billingRatio: 95 },
  { id: 'p11', name: 'Mu Logistics', pmId: 'pm3', pmName: 'David Ross', health: 'On Track', utilization: 85, wsrStatus: 'Green', wsrDelayDays: 0, auditScore: 90, lastAuditDate: '2023-10-19', riskLevel: 'Low', sowExpirationDate: '2024-06-30', resourceReleaseDate: '2024-03-15', resourceCount: 4, billingRatio: 82 },
  { id: 'p12', name: 'Nu HR Portal', pmId: 'pm4', pmName: 'Emily White', health: 'At Risk', utilization: 112, wsrStatus: 'Red', wsrDelayDays: 10, auditScore: 78, lastAuditDate: '2023-09-20', riskLevel: 'High', sowExpirationDate: '2023-11-05', resourceReleaseDate: '2023-11-01', resourceCount: 6, billingRatio: 65 },
];

const PM_DETAILS_MOCK: Record<string, any> = {
  'pm1': {
    email: 'sarah.jenkins@company.com',
    designation: 'Senior Project Manager',
    level: 'L4',
    reportingManager: 'Jordan Lee',
    coreExperience: '8.5 Years',
    totalExperience: '12 Years',
    teams: ['FinTech Core', 'Digital Transformation'],
    certifications: 'PMP, CSM, SAFe Agilist',
  },
  'pm2': {
    email: 'michael.chen@company.com',
    designation: 'Project Manager',
    level: 'L3',
    reportingManager: 'Sarah Jenkins',
    coreExperience: '5 Years',
    totalExperience: '9 Years',
    teams: ['Cloud Infra', 'DevOps'],
    certifications: 'AWS Certified, PSM I',
  },
  'pm3': {
    email: 'david.ross@company.com',
    designation: 'Senior Project Manager',
    level: 'L4',
    reportingManager: 'Jordan Lee',
    coreExperience: '10 Years',
    totalExperience: '15 Years',
    teams: ['Mobile Apps', 'Consumer Tech'],
    certifications: 'PMP, PRINCE2',
  },
  'pm4': {
    email: 'emily.white@company.com',
    designation: 'Project Manager',
    level: 'L3',
    reportingManager: 'Sarah Jenkins',
    coreExperience: '4 Years',
    totalExperience: '7 Years',
    teams: ['Enterprise CRM', 'Internal Tools'],
    certifications: 'CAPM, CSM',
  }
};

// --- Shared Components ---

const StatusBadge = ({ status, type = 'health' }: { status: string; type?: 'health' | 'wsr' | 'compliance' | 'risk' }) => {
  let colors = 'bg-gray-100 text-gray-700 border-gray-200';
  
  const s = status.toLowerCase();
  
  if (type === 'health' || type === 'compliance') {
    if (s === 'green' || s.includes('fully')) colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (s === 'amber' || s.includes('moderately')) colors = 'bg-amber-50 text-amber-700 border-amber-200';
    else if (s === 'red' || s.includes('non')) colors = 'bg-red-50 text-red-700 border-red-200';
  } else if (type === 'wsr') {
    if (s === 'submitted') colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (s === 'overdue') colors = 'bg-red-50 text-red-700 border-red-200';
  } else if (type === 'risk') {
    if (s === 'low') colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (s === 'medium') colors = 'bg-amber-50 text-amber-700 border-amber-200';
    else if (s === 'high') colors = 'bg-red-50 text-red-700 border-red-200';
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", colors)}>
      {status}
    </span>
  );
};

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

// --- Modals ---

const PMDetailsModal = ({ pm, projects, onClose }: { pm: PM, projects: Project[], onClose: () => void }) => {
  const details = PM_DETAILS_MOCK[pm.id] || PM_DETAILS_MOCK['pm1'];
  
  // Calculate specific utilization for this PM view
  const pmProjects = projects.filter(p => p.pmId === pm.id);
  const totalUtilization = pmProjects.reduce((acc, p) => acc + p.utilization, 0);
  const totalAvailability = Math.max(0, 100 - totalUtilization);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{pm.name} - Professional Details</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Header Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
            <div className="space-y-4">
               <div className="flex justify-between">
                 <span className="text-gray-500">Email:</span>
                 <span className="font-medium text-gray-900">{details.email}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Designation:</span>
                 <span className="font-medium text-gray-900">{details.designation}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Core Experience:</span>
                 <span className="font-medium text-gray-900">{details.coreExperience}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Total Utilization:</span>
                 <span className="font-medium text-gray-900">{totalUtilization}%</span>
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between">
                 <span className="text-gray-500">Level:</span>
                 <span className="font-medium text-gray-900">{details.level}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Reporting Manager:</span>
                 <span className="font-medium text-gray-900">{details.reportingManager}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Total Experience:</span>
                 <span className="font-medium text-gray-900">{details.totalExperience}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Total Availability:</span>
                 <span className="font-medium text-gray-900">{totalAvailability}%</span>
               </div>
            </div>
          </div>

          {/* Teams */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Teams:</h3>
            <div className="flex gap-3">
              {details.teams.map((team: string) => (
                <span key={team} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-700">
                  {team}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Projects Table */}
          <div>
             <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Projects:</h3>
             <div className="border border-gray-200 rounded-lg overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                   <tr>
                     <th className="px-4 py-3">Project Name</th>
                     <th className="px-4 py-3 text-center">Utilization</th>
                     <th className="px-4 py-3 text-center">Billable</th>
                     <th className="px-4 py-3 text-center">Role</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {pmProjects.map(p => (
                     <tr key={p.id}>
                       <td className="px-4 py-3 text-gray-900">{p.name}</td>
                       <td className="px-4 py-3 text-center font-medium">{p.utilization}%</td>
                       <td className="px-4 py-3 text-center">
                         <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">
                           Non-Billable
                         </span>
                       </td>
                       <td className="px-4 py-3 text-center">
                         <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium border border-purple-100">
                           Primary PM
                         </span>
                       </td>
                     </tr>
                   ))}
                   {pmProjects.length === 0 && (
                     <tr>
                       <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No active projects assigned.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Footer */}
          <div className="text-sm">
            <span className="font-medium text-gray-900">Certification: </span>
            <span className="text-gray-600">{details.certifications}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Views ---

const DashboardView = ({ projects }: { projects: Project[] }) => {
  const stats = useMemo(() => {
    return {
      total: projects.length,
      onTrack: projects.filter(p => p.health === 'On Track').length,
      atRisk: projects.filter(p => p.health === 'At Risk').length,
      offTrack: projects.filter(p => p.health === 'Off Track').length,
      wsrOverdue: projects.filter(p => p.wsrStatus === 'Amber').length,
      auditOverdue: projects.filter(p => new Date(p.lastAuditDate) < new Date('2023-10-01')).length, // Mock logic
      avgAuditScore: Math.round(projects.reduce((acc, p) => acc + p.auditScore, 0) / projects.length),
    };
  }, [projects]);

  const KPICard = ({ label, value, colorClass, subtext }: any) => (
    <Card className="p-5 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="flex items-end justify-between">
        <div className={cn("text-3xl font-bold", colorClass)}>{value}</div>
        {subtext && <div className="text-xs text-gray-400 mb-1">{subtext}</div>}
      </div>
    </Card>
  );

  // Projects with overdue WSR
  const overdueWSRProjects = useMemo(() => {
    return projects
      .filter(p => p.wsrStatus === 'Amber' || p.wsrDelayDays > 0)
      .sort((a, b) => b.wsrDelayDays - a.wsrDelayDays);
  }, [projects]);

  // Projects with overdue audit
  const overdueAuditProjects = useMemo(() => {
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    
    return projects
      .filter(p => {
        const auditDate = new Date(p.lastAuditDate);
        return auditDate < ninetyDaysAgo;
      })
      .sort((a, b) => new Date(a.lastAuditDate).getTime() - new Date(b.lastAuditDate).getTime());
  }, [projects]);

  // Key metrics calculations
  const keyMetrics = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Projects with expiring SOWs (within next 90 days)
    const expiringSOWs = projects
      .filter(p => {
        if (!p.sowExpirationDate) return false;
        const expDate = new Date(p.sowExpirationDate);
        const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
      })
      .map(p => ({
        ...p,
        expirationDate: p.sowExpirationDate!,
        daysUntilExpiry: Math.ceil((new Date(p.sowExpirationDate!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    // Projects releasing resources in next 30 days
    const releasingResources = projects
      .filter(p => {
        if (!p.resourceReleaseDate) return false;
        const releaseDate = new Date(p.resourceReleaseDate);
        return releaseDate >= today && releaseDate <= thirtyDaysFromNow;
      })
      .map(p => ({
        ...p,
        releaseDate: p.resourceReleaseDate!,
        daysUntilRelease: Math.ceil((new Date(p.resourceReleaseDate!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        resourceCount: p.resourceCount || 0
      }))
      .sort((a, b) => a.daysUntilRelease - b.daysUntilRelease);

    // Low billing ratio projects (below 75%)
    const lowBillingRatio = projects
      .filter(p => p.billingRatio !== undefined && p.billingRatio < 75)
      .sort((a, b) => (a.billingRatio || 0) - (b.billingRatio || 0));

    // High risk projects - count risks for each project
    const highRiskProjects = projects
      .map(p => {
        let riskCount = 0;
        const risks: string[] = [];
        
        if (p.riskLevel === 'High') {
          riskCount++;
          risks.push('High Risk Level');
        }
        if (p.auditScore < 80) {
          riskCount++;
          risks.push('Low Audit Score');
        }
        if (p.wsrStatus === 'Amber' || p.wsrDelayDays > 0) {
          riskCount++;
          risks.push('Overdue WSR');
        }
        if (p.billingRatio !== undefined && p.billingRatio < 70) {
          riskCount++;
          risks.push('Low Billing Ratio');
        }
        if (p.health === 'At Risk' || p.health === 'Off Track') {
          riskCount++;
          risks.push('Poor Health Status');
        }
        
        return { ...p, riskCount, risks };
      })
      .filter(p => p.riskCount > 0)
      .sort((a, b) => b.riskCount - a.riskCount);

    return { expiringSOWs, releasingResources, lowBillingRatio, highRiskProjects };
  }, [projects]);

  return (
    <div className="space-y-6">
      <SectionTitle title="Delivery Manager Dashboard" subtitle="High-level snapshot of project portfolio health and risks." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPICard label="Total Projects" value={stats.total} colorClass="text-gray-900" />
        <KPICard label="On Track" value={stats.onTrack} colorClass="text-emerald-600" />
        <KPICard label="At Risk" value={stats.atRisk} colorClass="text-amber-600" />
        <KPICard label="Off Track" value={stats.offTrack} colorClass="text-red-600" />
        <KPICard label="WSR Overdue" value={stats.wsrOverdue} colorClass="text-red-600" />
        <KPICard label="Audit Overdue" value={stats.auditOverdue} colorClass="text-amber-600" />
        <KPICard label="Avg Audit Score" value={`${stats.avgAuditScore}%`} colorClass="text-blue-600" />
      </div>

      {/* Dashboard Grid - Overdue Projects Side by Side
          Responsive layout:
          - Mobile/Tablet (< 768px): Single column (stacked)
          - Desktop (>= 768px): Two equal columns (side by side)
          - Gap: 16px (gap-4)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Projects with Overdue WSR */}
        <Card className="overflow-hidden flex flex-col h-full border-l-4 border-l-red-500">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Projects with Overdue WSR</h3>
              </div>
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                {overdueWSRProjects.length} OVERDUE
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Projects with delayed or missing weekly status reports</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto bg-gray-50">
            {overdueWSRProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No overdue WSR projects</div>
            ) : (
              <div className="space-y-3">
                {overdueWSRProjects.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{p.pmName}</div>
                      {p.wsrDelayDays > 0 && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          {p.wsrDelayDays} day{p.wsrDelayDays !== 1 ? 's' : ''} overdue
                        </div>
                      )}
                    </div>
                    <StatusBadge status={p.wsrStatus} type="wsr" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Projects with Overdue Audit */}
        <Card className="overflow-hidden flex flex-col h-full border-l-4 border-l-amber-500">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Projects with Overdue Audit</h3>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                {overdueAuditProjects.length} OVERDUE
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Projects requiring immediate audit review</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto bg-gray-50">
            {overdueAuditProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No overdue audit projects</div>
            ) : (
              <div className="space-y-3">
                {overdueAuditProjects.map(p => {
                  const daysSinceAudit = Math.floor((new Date().getTime() - new Date(p.lastAuditDate).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{p.pmName}</div>
                        <div className="text-xs text-amber-600 mt-1 font-medium">
                          Last audit: {daysSinceAudit} days ago
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-sm font-bold",
                          p.auditScore >= 90 ? "text-emerald-600" : p.auditScore >= 80 ? "text-amber-600" : "text-red-600"
                        )}>
                          {p.auditScore}
                        </div>
                        <StatusBadge status={p.auditScore >= 90 ? 'Fully Compliant' : p.auditScore >= 80 ? 'Moderately Compliant' : 'Non-Compliant'} type="compliance" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Key Metrics Cards Section */}
      <div className="space-y-6">
        {/* First Row: Expiring SOWs and Resources Releasing Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expiring SOWs Card */}
          <Card className="overflow-hidden flex flex-col border-l-4 border-l-red-500">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Expiring SOWs</h3>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {keyMetrics.expiringSOWs.filter(p => p.daysUntilExpiry <= 30).length} URGENT
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Immediate action required for contract renewals</p>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto bg-gray-50">
              {keyMetrics.expiringSOWs.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No expiring SOWs</div>
              ) : (
                <div className="space-y-2">
                  {keyMetrics.expiringSOWs.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.daysUntilExpiry <= 30 ? "bg-red-500" : "bg-amber-500"
                      )} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.daysUntilExpiry} days</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Resource Releases Card */}
          <Card className="overflow-hidden flex flex-col border-l-4 border-l-amber-500">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">Resources Releasing (30 Days)</h3>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                  {keyMetrics.releasingResources.length} TOTAL
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Plan reallocation or backfill requirements</p>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto bg-gray-50">
              {keyMetrics.releasingResources.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No resource releases scheduled</div>
              ) : (
                <div className="space-y-2">
                  {keyMetrics.releasingResources.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.daysUntilRelease <= 15 ? "bg-red-500" : "bg-amber-500"
                      )} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">
                          {p.resourceCount} resource{p.resourceCount !== 1 ? 's' : ''} ({p.daysUntilRelease} days)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Second Row: Low Billing Ratio and High Risk Projects Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Billing Ratio Card */}
          <Card className="overflow-hidden flex flex-col border-l-4 border-l-red-500">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Low Billing Ratio</h3>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {keyMetrics.lowBillingRatio.length} PROJECTS
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Projects below 70% utilization threshold</p>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto bg-gray-50">
              {keyMetrics.lowBillingRatio.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">All projects have healthy billing ratios</div>
              ) : (
                <div className="space-y-2">
                  {keyMetrics.lowBillingRatio.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{p.name}</div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "font-semibold text-sm",
                          (p.billingRatio || 0) < 60 ? "text-red-600" : (p.billingRatio || 0) < 70 ? "text-amber-600" : "text-gray-700"
                        )}>
                          {p.billingRatio}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* High Risk Projects Card */}
          <Card className="overflow-hidden flex flex-col border-l-4 border-l-red-500">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">High Risk Projects</h3>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {keyMetrics.highRiskProjects.length} PROJECTS
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Projects with multiple risk factors</p>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto bg-gray-50">
              {keyMetrics.highRiskProjects.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No high risk projects</div>
              ) : (
                <div className="space-y-2">
                  {keyMetrics.highRiskProjects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{p.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {p.riskCount} risk{p.riskCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PortfolioView = ({ projects }: { projects: Project[] }) => {
  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState('All');
  const [filterPM, setFilterPM] = useState('All');
  const [filterWSR, setFilterWSR] = useState('All');
  const [filterAudit, setFilterAudit] = useState('All');

  const uniquePMs = useMemo(() => Array.from(new Set(projects.map(p => p.pmName))), [projects]);

  const getCompliance = (score: number): ComplianceStatus => {
    if (score >= 90) return 'Fully Compliant';
    if (score >= 80) return 'Moderately Compliant';
    return 'Non-Compliant';
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchHealth = filterHealth === 'All' || p.health === filterHealth;
    const matchPM = filterPM === 'All' || p.pmName === filterPM;
    const matchWSR = filterWSR === 'All' || p.wsrStatus === filterWSR;
    
    const compliance = getCompliance(p.auditScore);
    const matchAudit = filterAudit === 'All' || compliance === filterAudit;

    return matchSearch && matchHealth && matchPM && matchWSR && matchAudit;
  });

  return (
    <div className="space-y-6">
       <SectionTitle title="Project Portfolio" subtitle="Detailed view of all assigned projects." />
       
       <Card className="overflow-hidden mt-6">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-gray-700 align-middle">
                     <div className="flex items-center gap-2">
                        <span>Project Name</span>
                        <div className="relative flex-1 max-w-[120px]">
                           <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                           <input 
                             type="text" 
                             placeholder="Search..." 
                             className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none font-normal bg-white"
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                           />
                        </div>
                     </div>
                   </th>
                   <th className="px-6 py-4 font-semibold text-gray-700 align-middle">
                      <div className="flex items-center gap-1 cursor-pointer relative group w-max">
                        <span>Project Manager</span>
                        <ChevronDown className={cn("w-4 h-4 transition-colors", filterPM !== 'All' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                        <select 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={filterPM}
                          onChange={(e) => setFilterPM(e.target.value)}
                        >
                          <option value="All">All Managers</option>
                          {uniquePMs.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                        </select>
                      </div>
                   </th>
                   <th className="px-6 py-4 font-semibold text-gray-700 align-middle">
                      <div className="flex items-center gap-1 cursor-pointer relative group w-max">
                        <span>Project Status</span>
                        <ChevronDown className={cn("w-4 h-4 transition-colors", filterHealth !== 'All' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                        <select 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={filterHealth}
                          onChange={(e) => setFilterHealth(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Green">Green</option>
                          <option value="Amber">Amber</option>
                          <option value="Red">Red</option>
                        </select>
                      </div>
                   </th>
                   <th className="px-6 py-4 font-semibold text-gray-700 align-middle">
                      <div className="flex items-center gap-1 cursor-pointer relative group w-max">
                        <span>WSR Status</span>
                        <ChevronDown className={cn("w-4 h-4 transition-colors", filterWSR !== 'All' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                        <select 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={filterWSR}
                          onChange={(e) => setFilterWSR(e.target.value)}
                        >
                          <option value="All">All WSR</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                   </th>
                   <th className="px-6 py-4 font-semibold text-gray-700 align-middle">
                      <div className="flex items-center gap-1 cursor-pointer relative group w-max">
                        <span>Audit Status</span>
                        <ChevronDown className={cn("w-4 h-4 transition-colors", filterAudit !== 'All' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                        <select 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={filterAudit}
                          onChange={(e) => setFilterAudit(e.target.value)}
                        >
                          <option value="All">All Compliance</option>
                          <option value="Fully Compliant">Fully Compliant</option>
                          <option value="Moderately Compliant">Moderately Compliant</option>
                          <option value="Non-Compliant">Non-Compliant</option>
                        </select>
                      </div>
                   </th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                 {filteredProjects.map(p => (
                   <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                     <td className="px-6 py-4 text-gray-600">{p.pmName}</td>
                     <td className="px-6 py-4"><StatusBadge status={p.health} type="health" /></td>
                     <td className="px-6 py-4 group relative cursor-help">
                        <StatusBadge status={p.wsrStatus} type="wsr" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Week 43
                        </div>
                     </td>
                     <td className="px-6 py-4 group relative cursor-help">
                       <StatusBadge status={getCompliance(p.auditScore)} type="compliance" />
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                         {new Date(p.lastAuditDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                       </div>
                     </td>
                   </tr>
                 ))}
                 {filteredProjects.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No projects found matching your filters.</td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
       </Card>
    </div>
  );
};

// Combined Resource Management View (Performance + Capacity)
const ResourceManagementView = ({ projects, pms }: { projects: Project[], pms: PM[] }) => {
  const [selectedPM, setSelectedPM] = useState<PM | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // PM Performance Stats
  const pmStats = useMemo(() => {
    return pms.map(pm => {
      const pmProjects = projects.filter(p => p.pmId === pm.id);
      const count = pmProjects.length;
      
      // Health Score Calculation
      const avgHealthScore = count ? pmProjects.reduce((acc, p) => {
        if (p.health === 'On Track' || p.health === 'Completed') return acc + 3;
        if (p.health === 'At Risk') return acc + 2;
        return acc + 1; // Off Track
      }, 0) / count : 0;
      const healthLabel = avgHealthScore > 2.5 ? 'Strong' : avgHealthScore > 1.8 ? 'Stable' : 'Needs Attn';

      // WSR Status Calculation
      const avgWsrScore = count ? pmProjects.reduce((acc, p) => {
        if (p.wsrStatus === 'Green') return acc + 3;
        if (p.wsrStatus === 'Amber') return acc + 2;
        return acc + 1; // Red
      }, 0) / count : 0;
      const wsrStatusLabel = avgWsrScore > 2.5 ? 'Green' : avgWsrScore > 1.8 ? 'Amber' : 'Red';

      const avgAudit = count ? Math.round(pmProjects.reduce((acc, p) => acc + p.auditScore, 0) / count) : 0;
      const avgUtil = count ? Math.round(pmProjects.reduce((acc, p) => acc + p.utilization, 0) / count) : 0;
      
      // Capacity Data
      const util = avgUtil;
      const status: UtilizationStatus = util > 110 ? 'Overloaded' : util < 70 ? 'Underutilized' : 'Optimal';

      return { ...pm, count, healthLabel, wsrStatusLabel, avgAudit, avgUtil, util, status };
    }).sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [pms, projects, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return <ChevronDown className={cn("w-4 h-4 text-blue-600 transition-transform", sortDirection === 'desc' ? "rotate-180" : "")} />;
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Resource Management" subtitle="Unified view of PM performance, compliance, and capacity." />

      {/* Modal */}
      {selectedPM && (
        <PMDetailsModal pm={selectedPM} projects={projects} onClose={() => setSelectedPM(null)} />
      )}

      {/* Combined Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('name')}
                 >
                   <div className="flex items-center gap-1">Project Manager <SortIcon field="name" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('count')}
                 >
                    <div className="flex items-center gap-1">Active Projects <SortIcon field="count" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('healthLabel')}
                 >
                    <div className="flex items-center gap-1">Avg. Health <SortIcon field="healthLabel" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('wsrStatusLabel')}
                 >
                    <div className="flex items-center gap-1">Avg. WSR Status <SortIcon field="wsrStatusLabel" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('avgAudit')}
                 >
                    <div className="flex items-center gap-1">Avg. Audit Score <SortIcon field="avgAudit" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('util')}
                 >
                    <div className="flex items-center gap-1">Utilization % <SortIcon field="util" /></div>
                 </th>
                 <th 
                   className="px-6 py-4 font-semibold text-gray-700 cursor-pointer group select-none hover:bg-gray-100 transition-colors"
                   onClick={() => handleSort('status')}
                 >
                    <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
                 </th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pmStats.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {d.avatar}
                      </div>
                      <button 
                        onClick={() => setSelectedPM(d)}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                      >
                        {d.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 pl-10">{d.count}</td>
                  <td className="px-6 py-4">
                    <span className={cn("font-medium", d.healthLabel === 'Strong' ? 'text-emerald-600' : d.healthLabel === 'Stable' ? 'text-amber-600' : 'text-red-600')}>
                      {d.healthLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={cn("font-medium", d.wsrStatusLabel === 'Green' ? 'text-emerald-600' : d.wsrStatusLabel === 'Amber' ? 'text-amber-600' : 'text-red-600')}>
                        {d.wsrStatusLabel}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={cn("font-medium", d.avgAudit >= 90 ? 'text-emerald-600' : d.avgAudit >= 80 ? 'text-amber-600' : 'text-red-600')}>
                        {d.avgAudit}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <span className={cn("font-medium w-8 text-right", d.util > 110 ? "text-red-600" : "text-gray-700")}>{d.util}%</span>
                       <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className={cn("h-full rounded-full", d.status === 'Overloaded' ? "bg-red-500" : d.status === 'Underutilized' ? "bg-blue-300" : "bg-emerald-500")} style={{ width: `${Math.min(d.util, 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs font-medium", 
                      d.status === 'Overloaded' ? 'bg-red-100 text-red-700' : 
                      d.status === 'Underutilized' ? 'bg-blue-50 text-blue-700' : 
                      'bg-emerald-50 text-emerald-700')}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const WSROversight = ({ projects }: { projects: Project[] }) => {
  const weeks = [
    'Oct 23 - Oct 29',
    'Oct 16 - Oct 22',
    'Oct 09 - Oct 15',
    'Oct 02 - Oct 08'
  ];
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionTitle title="WSR Oversight" subtitle="Track weekly status report submissions." />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Select Week:</span>
          <div className="relative">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
            >
              {weeks.map((week) => (
                <option key={week} value={week}>{week}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">Project</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Manager</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Week Cycle</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Delay (Days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
             {projects.map(p => (
               <tr key={p.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                 <td className="px-6 py-4 text-gray-600">{p.pmName}</td>
                 <td className="px-6 py-4 text-gray-600">{selectedWeek}</td>
                 <td className="px-6 py-4"><StatusBadge status={p.wsrStatus} type="wsr" /></td>
                 <td className="px-6 py-4">
                   {p.wsrDelayDays > 0 ? (
                     <span className="text-red-600 font-bold flex items-center gap-1">
                       <AlertTriangle className="w-3 h-3" /> {p.wsrDelayDays} Days
                     </span>
                   ) : (
                     <span className="text-gray-400">-</span>
                   )}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AuditCompliance = ({ projects }: { projects: Project[] }) => {
  const getCompliance = (score: number): ComplianceStatus => {
    if (score >= 90) return 'Fully Compliant';
    if (score >= 80) return 'Moderately Compliant';
    return 'Non-Compliant';
  };

  // Extract unique months and years from project data
  const availableMonthsYears = useMemo(() => {
    const monthYearSet = new Set<string>();
    projects.forEach(p => {
      const date = new Date(p.lastAuditDate);
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const year = date.getFullYear();
      monthYearSet.add(`${year}-${month.toString().padStart(2, '0')}`);
    });
    
    const sorted = Array.from(monthYearSet).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });

    const months = Array.from(new Set(sorted.map(item => {
      const [, month] = item.split('-');
      return parseInt(month);
    }))).sort((a, b) => b - a);

    const years = Array.from(new Set(sorted.map(item => {
      const [year] = item.split('-');
      return parseInt(year);
    }))).sort((a, b) => b - a);

    return { months, years, all: sorted };
  }, [projects]);

  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Filter projects based on selected month and year
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedMonth === 'All' && selectedYear === 'All') return true;
      
      const date = new Date(p.lastAuditDate);
      const projectMonth = (date.getMonth() + 1).toString();
      const projectYear = date.getFullYear().toString();

      const matchMonth = selectedMonth === 'All' || projectMonth === selectedMonth;
      const matchYear = selectedYear === 'All' || projectYear === selectedYear;

      return matchMonth && matchYear;
    });
  }, [projects, selectedMonth, selectedYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <SectionTitle title="Audit & Compliance" subtitle="Monitor audit scores and compliance status." />
         <div className="flex items-center gap-3">
           <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-gray-700">Month:</span>
             <div className="relative">
               <select
                 value={selectedMonth}
                 onChange={(e) => setSelectedMonth(e.target.value)}
                 className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
               >
                 <option value="All">All Months</option>
                 {availableMonthsYears.months.map(month => (
                   <option key={month} value={month.toString()}>
                     {monthNames[month - 1]}
                   </option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                 <ChevronDown className="h-4 w-4" />
               </div>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-gray-700">Year:</span>
             <div className="relative">
               <select
                 value={selectedYear}
                 onChange={(e) => setSelectedYear(e.target.value)}
                 className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
               >
                 <option value="All">All Years</option>
                 {availableMonthsYears.years.map(year => (
                   <option key={year} value={year.toString()}>{year}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                 <ChevronDown className="h-4 w-4" />
               </div>
             </div>
           </div>
         </div>
       </div>
       <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">Project</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Audit Score</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Audit Status</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Last Audit</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Manager</th>

              {/* <th className="px-6 py-3 font-semibold text-gray-700">Action</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No projects found for the selected month and year.
                </td>
              </tr>
            ) : (
              filteredProjects.map(p => {
                const compliance = getCompliance(p.auditScore);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className={cn("font-bold", compliance === 'Non-Compliant' ? 'text-red-600' : 'text-gray-700')}>
                        {p.auditScore}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={compliance} type="compliance" /></td>
                    <td className="px-6 py-4 text-gray-600">{p.lastAuditDate}</td>
                    <td className="px-6 py-4 text-gray-600">{p.pmName}</td>
                    {/* <td className="px-6 py-4">
                      {compliance === 'Non-Compliant' ? (
                        <button className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-100 font-medium">Escalate</button>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td> */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
       </Card>
    </div>
  );
};

const EscalationView = ({ projects }: { projects: Project[] }) => {
  const escalations = projects.filter(p => 
    p.health === 'At Risk' || 
    p.auditScore < 80 || 
    p.wsrDelayDays > 7 || 
    p.utilization > 110
  ).map(p => {
    const reasons: string[] = [];
    if (p.health === 'At Risk') reasons.push('Critical Project Health Status');
    if (p.auditScore < 80) reasons.push('Low Audit Health Score');
    if (p.wsrDelayDays > 7) reasons.push('Overdue WSRs');
    if (p.utilization > 110) reasons.push('Resource Overload');
    
    return { ...p, reasons, severity: reasons.length > 1 ? 'High' : 'Medium' };
  });

  return (
    <div className="space-y-6">
      <SectionTitle title="Risks & Escalation" subtitle="High-priority risks requiring immediate attention." />
      
      {escalations.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
           <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
           <h3 className="text-lg font-medium text-gray-900">No Critical Escalations</h3>
           <p>All projects are operating within acceptable risk parameters.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {escalations.map(p => (
            <div key={p.id} className="bg-white border-l-4 border-l-red-500 rounded-r-lg shadow-sm border-y border-r border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                   <span className={cn("px-2 py-0.5 text-xs font-bold uppercase rounded", p.severity === 'High' ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800")}>
                     {p.severity} Priority
                   </span>
                 </div>
                 <div className="text-sm text-gray-600 mb-2">Manager: {p.pmName}</div>
                 <div className="flex flex-wrap gap-2">
                   {p.reasons.map(r => (
                     <span key={r} className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                       <AlertTriangle className="w-3 h-3 mr-1" /> {r}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Layout & App ---

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Project Portfolio', icon: Briefcase },
    { id: 'resources', label: 'PM Performance', icon: Users },
    { id: 'escalation', label: 'Risks & Escalation', icon: AlertTriangle },
    { id: 'wsr', label: 'WSR Oversight', icon: FileText },
    { id: 'audit', label: 'Audit & Compliance', icon: ShieldCheck },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <DashboardView projects={PROJECTS} />;
      case 'portfolio': return <PortfolioView projects={PROJECTS} />;
      case 'resources': return <ResourceManagementView projects={PROJECTS} pms={PMS} />;
      case 'escalation': return <EscalationView projects={PROJECTS} />;
      case 'wsr': return <WSROversight projects={PROJECTS} />;
      case 'audit': return <AuditCompliance projects={PROJECTS} />;
      default: return <DashboardView projects={PROJECTS} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="font-bold text-white text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            MakeDeliver
          </div>
          <button className="ml-auto lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeView === item.id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeView === item.id ? "text-white" : "text-slate-500 group-hover:text-white")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
              <p className="text-xs text-slate-500 truncate">Delivery Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex text-sm text-gray-500">
              <span className="hover:text-gray-900 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">{navItems.find(n => n.id === activeView)?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}