import { Link } from '@inertiajs/react';
import { MapPin, DollarSign, Users, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Job, JobType } from '@/types';

interface JobCardProps {
    job: Job;
    userRole?: string;
    onApply?: (job: Job) => void;
    showFarm?: boolean;
}

const jobTypeLabels: Record<JobType, string> = {
    planting: 'Planting',
    harvesting: 'Harvesting',
    weeding: 'Weeding',
    irrigation: 'Irrigation',
    plowing: 'Plowing',
    spraying: 'Spraying',
    general: 'General',
    other: 'Other',
};

const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
};

export function JobCard({ job, userRole = 'consumer', onApply, showFarm = true }: JobCardProps) {
    const canApply = userRole === 'laborer';
    const canManage = ['farmer', 'farm_manager'].includes(userRole);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <Badge className={statusColors[job.status]}>{job.status.replace('_', ' ')}</Badge>
                </div>
                {showFarm && job.farm && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {job.farm.name}
                    </p>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{jobTypeLabels[job.job_type]}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-farm-secondary">
                            <DollarSign className="h-3 w-3" />
                            {job.pay_rate}/{job.pay_type}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {job.applicant_count} applicants
                        </span>
                    </div>
                    {(job.start_date || job.end_date) && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {job.start_date && new Date(job.start_date).toLocaleDateString()}
                                {job.start_date && job.end_date && ' - '}
                                {job.end_date && new Date(job.end_date).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                {canApply && job.status === 'open' && onApply ? (
                    <Button className="w-full" onClick={() => onApply(job)}>Apply Now</Button>
                ) : (
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

interface JobCardCompactProps {
    job: Job;
    status?: 'pending' | 'accepted' | 'rejected';
}

export function JobCardCompact({ job, status }: JobCardCompactProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
            <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{job.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.farm?.name}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-farm-secondary text-sm">${job.pay_rate}</span>
                {status && (
                    <Badge 
                        variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}
                    >
                        {status}
                    </Badge>
                )}
            </div>
        </div>
    );
}