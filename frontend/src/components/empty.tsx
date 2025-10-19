import React from "react";

interface EmptyProps {
    empty: boolean;
}

const Empty: React.FC<EmptyProps> = ({ empty }) => {
    return (
        <div>
        </div>
    );
};

export default Empty;
