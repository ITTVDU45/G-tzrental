export interface Category {
    id: string;
    label: string;
    iconKey: string;
    image?: string;
    link?: string;
}

export interface DeviceType {
    id: string;
    categoryId: string;
    label: string;
    iconKey: string;
    description?: string;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterField {
    id: string;
    key: string;
    label: string;
    type: 'slider' | 'select' | 'radio' | 'checkbox';
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    defaultValue?: number | string | string[];
    options?: FilterOption[];
}

export interface FiltersConfig {
    items: FilterField[];
}

export interface ExtraOption {
    id: string;
    key: string;
    label: string;
    description: string;
    priceHint?: string;
    price: number;
    priceType: 'daily' | 'one-time';
}

export interface Product {
    id: string;
    title: string;
    deviceTypeId: string;
    image?: string;
    specs: {
        maxHeight: number;
        maxReach: number;
        maxLoad: number;
    };
    badges?: string[];
    price: number;
}

export interface ConfiguratorData {
    location: {
        id: string;
        slug: string;
        name: string;
    };
    categories: Category[];
    deviceTypes: DeviceType[];
    filters: FiltersConfig;
    extras: ExtraOption[];
    upsellingProducts: Product[];
    steps: { key: string; title: string; required: boolean; order: number }[];
}

export interface RecommendationResult {
    suitableDeviceTypes: { id: string; label: string }[];
    products: Product[];
}

// State Types
export interface ConfiguratorState {
    step: number;

    // Selections
    categoryId: string | null;
    requirements: {
        sliders: Record<string, number>;
        selects: Record<string, string>;
    };
    deviceTypeId: string | null;
    selectedProductIds: string[];
    addedUpsellingIds: string[];
    selectedExtras: string[];

    contact: {
        startDate: Date | null;
        endDate: Date | null;
        delivery: boolean;
        location: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        message: string;
        files: File[];
    };

    // Data & Async
    configData: ConfiguratorData | null;
    recommendations: RecommendationResult | null;
    isLoading: boolean;
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;
}
