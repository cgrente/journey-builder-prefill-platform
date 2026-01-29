import type { Form } from "../model/types";

type FormListProps = {
  forms: Form[];
};

export function FormList({forms}: FormListProps) {
    return (
        <ul>
            {forms.map((form) => (
                <li key={form.id}>
                    <strong>{form.name}</strong>
                    <div style={{ fontSize:12, opacity: 0.7}}>{form.id}</div>
                </li>
            ))}
        </ul>
    )
}