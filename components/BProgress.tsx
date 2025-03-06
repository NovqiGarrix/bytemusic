'use client';

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

const BProgress = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProgressProvider
            color="#fff"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </ProgressProvider>
    );
};

export default BProgress;