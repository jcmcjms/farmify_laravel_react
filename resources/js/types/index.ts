import { LucideIcon } from 'lucide-react';

export type UserRole = 'farmer' | 'farm_manager' | 'laborer' | 'consumer' | 'rider';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar_url?: string;
    rating?: number;
    address?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Farm {
    id: number;
    name: string;
    owner_id: number;
    owner?: User;
    location: string;
    size: number;
    size_unit: 'acres' | 'hectares';
    status: 'active' | 'inactive' | 'pending';
    plots?: Plot[];
    products?: Product[];
    jobs?: Job[];
    created_at: string;
    updated_at: string;
}

export interface Plot {
    id: number;
    farm_id: number;
    name: string;
    size: number;
    size_unit: 'acres' | 'hectares';
    crop?: string;
    status: 'active' | 'fallow' | 'preparing';
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    farmer_id: number;
    farmer?: User;
    farm_id: number;
    farm?: Farm;
    category: ProductCategory;
    price: number;
    price_unit: 'kg' | 'lb' | 'piece' | 'bunch';
    stock: number;
    unit: string;
    images?: string[];
    status: 'available' | 'out_of_stock' | 'pending' | 'discontinued';
    created_at: string;
    updated_at: string;
}

export type ProductCategory = 
    | 'vegetables'
    | 'fruits'
    | 'herbs'
    | 'dairy'
    | 'eggs'
    | 'meat'
    | 'grains'
    | 'other';

export interface Job {
    id: number;
    title: string;
    description: string;
    farm_id: number;
    farm?: Farm;
    poster_id: number;
    poster?: User;
    job_type: JobType;
    pay_rate: number;
    pay_type: 'hourly' | 'daily' | 'fixed';
    status: 'open' | 'closed' | 'in_progress' | 'completed';
    start_date?: string;
    end_date?: string;
    applicant_count: number;
    created_at: string;
    updated_at: string;
}

export type JobType = 
    | 'planting'
    | 'harvesting'
    | 'weeding'
    | 'irrigation'
    | 'plowing'
    | 'spraying'
    | 'general'
    | 'other';

export interface JobApplication {
    id: number;
    job_id: number;
    job?: Job;
    laborer_id: number;
    laborer?: User;
    status: 'pending' | 'accepted' | 'rejected';
    cover_letter?: string;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    is_read: boolean;
    user_id: number;
    created_at: string;
}

export interface ApiResponse<T> {
    data: T;
    meta?: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
}

export interface AuthState {
    user: User;
    token?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface FormErrors {
    [key: string]: string[];
}

export interface ValidationError {
    message: string;
    field?: string;
}