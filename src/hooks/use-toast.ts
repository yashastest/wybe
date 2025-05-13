import * as React from "react";
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "destructive";

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  type?: ToastType;
  duration?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Toast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<Toast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                onOpenChange: (open) => {
                  if (!open) t.onOpenChange?.(false);
                },
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

type ToasterToast = ReturnType<typeof toast>;

// Define ToastOptions for helper methods
interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  type?: ToastType;
}

export function toast(props: ToastOptions) {
  const id = genId();

  const update = (props: ToastOptions) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Define success helper method
toast.success = (message: string, options: Omit<ToastOptions, "type"> = {}) => {
  return toast({
    ...options,
    title: message,
    type: "success",
  });
};

// Define error helper method
toast.error = (message: string, options: Omit<ToastOptions, "type"> = {}) => {
  return toast({
    ...options,
    title: message,
    type: "error",
  });
};

// Define warning helper method
toast.warning = (message: string, options: Omit<ToastOptions, "type"> = {}) => {
  return toast({
    ...options,
    title: message,
    type: "warning",
  });
};

// Define info helper method
toast.info = (message: string, options: Omit<ToastOptions, "type"> = {}) => {
  return toast({
    ...options,
    title: message,
    type: "info",
  });
};

type UseToastOptions = Partial<
  Pick<Toast, "type" | "duration" | "variant" | "className">
>;

export function useToast(options?: UseToastOptions) {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast: React.useCallback(
      (props: ToastOptions) =>
        toast({
          ...options,
          ...props,
        }),
      [options]
    ),
    dismiss: React.useCallback((toastId?: string) => {
      dispatch({
        type: "DISMISS_TOAST",
        toastId,
      });
    }, []),
  };
}
