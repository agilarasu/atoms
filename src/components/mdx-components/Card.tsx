import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CustomCard = memo(({ title, children }: { title?: string; children: React.ReactNode }) => {
    if (!children) return null;
    return (
        <Card className="my-4">
            <CardHeader>
                <CardTitle>{title || ''}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
});

CustomCard.displayName = 'Card';

export { CustomCard as Card };