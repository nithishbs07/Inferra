import { ArrowUp } from "lucide-react";
import { cn } from "#/utils/utils";

export interface ChatSendButtonProps {
  buttonClassName: string;
  handleSubmit: () => void;
  disabled: boolean;
}

export function ChatSendButton({
  buttonClassName,
  handleSubmit,
  disabled,
}: ChatSendButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-full size-9 transition-all duration-150 shadow-sm",
        disabled
          ? "cursor-not-allowed bg-[var(--surface-2)]"
          : "cursor-pointer bg-[var(--brand-primary)] hover:brightness-110 hover:scale-105 active:scale-95",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <ArrowUp size={17} color={disabled ? "#959CB2" : "white"} />
    </button>
  );
}
