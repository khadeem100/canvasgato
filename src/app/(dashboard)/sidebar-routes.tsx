"use client";

import {
  BookText,
  CreditCard,
  Crown,
  Home,
  MessageCircleQuestion,
  PackageCheck,
  Rotate3d,
  ShoppingBag,
  StickyNote,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useBilling } from "@/features/subscriptions/api/use-billing";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { SidebarItem } from "./sidebar-item";

// New NotesCard component for displaying your notes
const NotesCard = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      
      <h3 className="text-lg font-bold mb-2">Reminder</h3>
      <p className="text-sm text-gray-600">
        {/* Example Note - Replace this text with actual notes */}
        Don&apos;t forget to finish your order submission after creating you visual file
      </p>
    </div>
  );
};

export const SidebarRoutes = () => {
  const mutation = useCheckout();
  const billingMutation = useBilling();
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

  const pathname = usePathname();

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    billingMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && !isLoading && (
        <>
          <div className="px-3">
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
              variant="outline"
              size="lg"
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Get the pro version
            </Button>
          </div>
          <div className="px-3">
            <Separator />
          </div>
        </>
      )}
      
      {/* Add NotesCard here */}
      <div className="px-3">
        <NotesCard />
      </div>
      
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />
        <SidebarItem href="https://gato-calender.vercel.app/" icon={PackageCheck} label="Create Order" isActive={pathname === ""} />
      </ul>
      
      <div className="px-3">
        <Separator />
      </div>
      
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem href={pathname} icon={Crown} label="Admin" onClick={onClick} />
        <SidebarItem href="https://gatosports.com" icon={ShoppingBag} label="Gato-shop" onClick={onClick} />
        <SidebarItem href="https://threejs-t-shirt-main.vercel.app/" icon={Rotate3d} label="3D Viewer" onClick={onClick} />
        <SidebarItem
          href="mailto:office@gato-international.com"
          icon={MessageCircleQuestion}
          label="Get Help"
        />
        <SidebarItem href={pathname} icon={BookText} label="Documentation" onClick={onClick} />
      </ul>
    </div>
  );
};

