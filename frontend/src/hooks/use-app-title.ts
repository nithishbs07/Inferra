import { useParams } from "react-router";
import { useConfig } from "#/hooks/query/use-config";
import { useUserConversation } from "#/hooks/query/use-user-conversation";

const APP_TITLE_OSS = "Inferra";
const APP_TITLE_SAAS = "Inferra Cloud";

/**
 * Hook that returns the appropriate document title based on app_mode and current route.
 * - For conversation pages: "Conversation Title | Inferra" or "Conversation Title | Inferra Cloud"
 * - For other pages: "Inferra" or "Inferra Cloud"
 */
export const useAppTitle = () => {
  const { data: config } = useConfig();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data: conversation } = useUserConversation(conversationId ?? null);

  const appTitle = config?.app_mode === "oss" ? APP_TITLE_OSS : APP_TITLE_SAAS;
  const conversationTitle = conversation?.title;

  if (conversationId && conversationTitle) {
    return `${conversationTitle} | ${appTitle}`;
  }

  return appTitle;
};
