/**
 * Inferra — UI Component Library Barrel Export
 *
 * Import all components from this single entry point:
 * ```tsx
 * import { Button, Card, Dialog, Tabs } from "#/components/ui";
 * ```
 */

// ─── Primitives ────────────────────────────────────────────
export { Button, buttonVariants } from "./button";
export { Input } from "./input";
export { Textarea } from "./textarea";
export { Label } from "./label";
export { Separator } from "./separator";
export { Badge, badgeVariants } from "./badge";
export { Skeleton } from "./skeleton";
export { Spinner } from "./spinner";
export { Progress } from "./progress";
export { ScrollArea, ScrollBar } from "./scroll-area";

// ─── Data Display ──────────────────────────────────────────
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export { Avatar, AvatarImage, AvatarFallback } from "./avatar";
export { Alert, AlertTitle, AlertDescription } from "./alert";
export { EmptyState } from "./empty-state";

// ─── Overlays ──────────────────────────────────────────────
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
export { Popover, PopoverTrigger, PopoverContent } from "./popover";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";

// ─── Interactive ───────────────────────────────────────────
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
export { Switch } from "./switch";
export { Checkbox } from "./checkbox";
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./select";
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "./command";

// ─── Feedback ──────────────────────────────────────────────
export { Toaster, toast } from "./toast";
