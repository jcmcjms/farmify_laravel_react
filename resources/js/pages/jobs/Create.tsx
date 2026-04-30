import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { Job, JobType } from '@/types';

interface JobFormProps {
    job?: Job;
    isEdit?: boolean;
    farms?: { id: number; name: string }[];
}

const jobTypes: JobType[] = [
    'planting', 'harvesting', 'weeding', 'irrigation', 'plowing', 'spraying', 'general', 'other'
];

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

export default function JobForm({ job, isEdit = false, farms = [] }: JobFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: job?.title || '',
        description: job?.description || '',
        farm_id: job?.farm_id?.toString() || '',
        job_type: job?.job_type || '',
        pay_rate: job?.pay_rate?.toString() || '',
        pay_type: job?.pay_type || 'hourly',
        start_date: job?.start_date || '',
        end_date: job?.end_date || '',
        status: job?.status || 'open',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && job) {
            post(route('jobs.update', job.id));
        } else {
            post(route('jobs.store'));
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Job' : 'Post a Job'} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/jobs">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEdit ? 'Edit Job' : 'Post a New Job'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Update job details' : 'Find workers for your farm'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Harvest Worker Needed"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the job responsibilities..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="farm_id">Farm</Label>
                                <Select 
                                    value={data.farm_id} 
                                    onValueChange={(val) => setData('farm_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select farm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {farms.map((farm) => (
                                            <SelectItem key={farm.id} value={farm.id.toString()}>
                                                {farm.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="job_type">Job Type</Label>
                                <Select 
                                    value={data.job_type} 
                                    onValueChange={(val) => setData('job_type', val as JobType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {jobTypeLabels[type]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Compensation & Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="pay_rate">Pay Rate</Label>
                                    <Input
                                        id="pay_rate"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.pay_rate}
                                        onChange={(e) => setData('pay_rate', e.target.value)}
                                        placeholder="15.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pay_type">Pay Type</Label>
                                    <Select 
                                        value={data.pay_type} 
                                        onValueChange={(val) => setData('pay_type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="fixed">Fixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End Date (optional)</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select 
                                    value={data.status} 
                                    onValueChange={(val) => setData('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/jobs">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Job' : 'Post Job'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}