import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Filter, Plus, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Job, JobType } from '@/types';

interface JobsIndexProps {
    jobs: Job[];
    userRole?: string;
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

export default function Index({ jobs = [], userRole = 'consumer' }: JobsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = jobTypeFilter === 'all' || job.job_type === jobTypeFilter;
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const canCreateJob = ['farmer', 'farm_manager'].includes(userRole);

    return (
        <>
            <Head title="Jobs" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
                        <p className="text-muted-foreground">
                            {userRole === 'laborer' ? 'Find work opportunities' : 'Post and manage farm jobs'}
                        </p>
                    </div>
                    {canCreateJob && (
                        <Button asChild>
                            <Link href="/jobs/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Post Job
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {Object.entries(jobTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredJobs.length === 0 ? (
                    <EmptyState
                        icon={<Users className="h-12 w-12" />}
                        title="No jobs found"
                        description={searchQuery ? "No jobs match your search." : "No jobs available yet."}
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <JobCard key={job.id} job={job} userRole={userRole} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface JobCardProps {
    job: Job;
    userRole: string;
}

function JobCard({ job, userRole }: JobCardProps) {
    const statusColors = {
        open: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-purple-100 text-purple-800',
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <Badge className={statusColors[job.status]}>{job.status.replace('_', ' ')}</Badge>
                </div>
                {job.farm && (
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
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}