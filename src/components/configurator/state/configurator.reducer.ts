import { ConfiguratorState, ConfiguratorData, RecommendationResult } from "./configurator.types";

export type ConfiguratorAction =
    | { type: 'SET_DATA'; payload: ConfiguratorData }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'GOTO_STEP'; payload: number }
    | { type: 'SELECT_CATEGORY'; payload: string }
    | { type: 'UPDATE_REQUIREMENTS'; payload: { sliders?: Record<string, number>; selects?: Record<string, string> } }
    | { type: 'SET_RECOMMENDATIONS'; payload: RecommendationResult }
    | { type: 'SELECT_DEVICE_TYPE'; payload: string }
    | { type: 'TOGGLE_PRODUCT_SELECTION'; payload: string }
    | { type: 'TOGGLE_EXTRA'; payload: string }
    | { type: 'TOGGLE_UPSELLING'; payload: string }
    | { type: 'UPDATE_CONTACT'; payload: Partial<ConfiguratorState['contact']> }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_FAILURE'; payload: string };

export const initialState: ConfiguratorState = {
    step: 1,
    categoryId: null,
    requirements: { sliders: {}, selects: {} },
    deviceTypeId: null,
    selectedProductIds: [],
    addedUpsellingIds: [],
    selectedExtras: [],
    contact: {
        startDate: null,
        endDate: null,
        delivery: true,
        location: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        files: []
    },
    configData: null,
    recommendations: null,
    isLoading: true,
    isSubmitting: false,
    isSuccess: false,
    error: null
};

export function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction): ConfiguratorState {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, configData: action.payload, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'NEXT_STEP':
            const nextStep = state.step + 1;
            // Simple boundary check; more complex validation should happen before dispatch or in effects
            return { ...state, step: nextStep };
        case 'PREV_STEP':
            return { ...state, step: Math.max(1, state.step - 1) };
        case 'GOTO_STEP':
            return { ...state, step: action.payload };
        case 'SELECT_CATEGORY':
            // Reset downstream choices if category changes
            if (state.categoryId === action.payload) return state;
            return {
                ...state,
                categoryId: action.payload,
                deviceTypeId: null,
                selectedProductIds: [],
                recommendations: null,
                // Reset requirements defaults potentially?
                // keeping current requirement filters might be okay if they share keys (e.g. height)
            };
        case 'UPDATE_REQUIREMENTS':
            return {
                ...state,
                requirements: {
                    sliders: { ...state.requirements.sliders, ...action.payload.sliders },
                    selects: { ...state.requirements.selects, ...action.payload.selects }
                }
            };
        case 'SET_RECOMMENDATIONS':
            return { ...state, recommendations: action.payload };
        case 'SELECT_DEVICE_TYPE':
            return { ...state, deviceTypeId: action.payload, selectedProductIds: [] }; // Reset products if device type changes
        case 'TOGGLE_PRODUCT_SELECTION':
            const exists = state.selectedProductIds.includes(action.payload);
            let newSelection;
            // logic for single select vs multi select could go here. Assuming Multi for now or Single enforced by UI.
            // Let's assume single product selection for simplicity unless "multi" is required.
            // Actually spec says "products optional select".
            if (exists) {
                newSelection = state.selectedProductIds.filter(id => id !== action.payload);
            } else {
                newSelection = [...state.selectedProductIds, action.payload];
            }
            return { ...state, selectedProductIds: newSelection };
        case 'TOGGLE_EXTRA':
            const extraExists = state.selectedExtras.includes(action.payload);
            return {
                ...state,
                selectedExtras: extraExists
                    ? state.selectedExtras.filter(id => id !== action.payload)
                    : [...state.selectedExtras, action.payload]
            };
        case 'TOGGLE_UPSELLING':
            const upsellingExists = state.addedUpsellingIds.includes(action.payload);
            return {
                ...state,
                addedUpsellingIds: upsellingExists
                    ? state.addedUpsellingIds.filter(id => id !== action.payload)
                    : [...state.addedUpsellingIds, action.payload]
            };
        case 'UPDATE_CONTACT':
            return { ...state, contact: { ...state.contact, ...action.payload } };
        case 'SUBMIT_START':
            return { ...state, isSubmitting: true, error: null };
        case 'SUBMIT_SUCCESS':
            return { ...state, isSubmitting: false, isSuccess: true };
        case 'SUBMIT_FAILURE':
            return { ...state, isSubmitting: false, error: action.payload };
        default:
            return state;
    }
}
