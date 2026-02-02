import { Button } from "./button";
import { Spinner } from "./spinner";

export function ButtonSpinner() {
    return (
        <div className="flex gap-2">
            <Button variant="outline">
                <Spinner data-icon="inline-start" />
                Generating
            </Button>
        </div>
    );
}
