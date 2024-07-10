"use client";

import { useActionState } from "react";

export function Form(
  props: {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (prevState: any, formData: FormData) => Promise<ActionResult>;
  } & React.HTMLAttributes<HTMLFormElement>,
) {
  const { children, action, ...rest } = props;

  const [state, formAction] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} {...rest}>
      {children}
      {state.error && <p className="pt-4 text-red-700">{state.error}</p>}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
