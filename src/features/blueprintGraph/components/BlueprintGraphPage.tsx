import { useBlueprintGraph } from "../state/useBlueprintGraph";
import { FormList } from "./FormList";

export function BlueprintGraphPage() {
    const { data, isLoading, error } = useBlueprintGraph();
    const forms = data?.forms ?? []

    if (isLoading) {
        return <div>Loading blueprint graph...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Forms</h1>
            {forms.length === 0 ? (
                <div>No forms found.</div>
            ) : (
                <FormList forms={forms} />
            )}
        </div>
    );
}