import React, { memo } from 'react';

// Custom components with safety checks
const CustomHeading = memo(({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return <h1 className="text-2xl font-bold my-4 text-blue-600">{children}</h1>;
});

CustomHeading.displayName = 'CustomHeading';

const CustomParagraph = memo(({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return <p className="my-2 leading-relaxed">{children}</p>;
});
CustomParagraph.displayName = 'CustomParagraph';

export { CustomHeading, CustomParagraph };