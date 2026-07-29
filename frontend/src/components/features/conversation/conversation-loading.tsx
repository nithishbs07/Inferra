import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";

type ConversationLoadingProps = {
  className?: string;
};

export function ConversationLoading({ className }: ConversationLoadingProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center bg-[var(--surface-1)]",
        className,
      )}
    >
      <LoaderCircle className="animate-spin w-16 h-16" color="white" />
      <span className="p-4 text-2xl font-normal leading-5 text-[var(--text-primary)]">
        {t(I18nKey.HOME$LOADING)}
      </span>
    </div>
  );
}
