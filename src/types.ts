interface FormComponentProps {
    nextStep: () => void;
    prevStep: () => void;
}

interface DateRange {
    startDate: Date;
    endDate: Date;
}

export type { FormComponentProps, DateRange };