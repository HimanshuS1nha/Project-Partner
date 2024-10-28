"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useUpgradePlanDialog } from "@/hooks/useUpgradePlanDialog";
import { useUser } from "@/hooks/useUser";

const UpgradePlanDialog = () => {
  const { isVisible, setIsVisible } = useUpgradePlanDialog();
  const user = useUser((state) => state.user);
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl font-bold">
              Project<span className="text-indigo-600 font-bold">Partner</span>
            </p>
          </DialogTitle>
          <DialogDescription>
            You are on {user?.planType} plan. Your plan only supports{" "}
            {user?.planType === "Pro" ? "10" : "1"} project(s){" "}
            {user?.planType === "Basic" && "(10 tasks per project)"}. Upgrade
            your plan now to create more.
          </DialogDescription>
        </DialogHeader>

        <Button asChild>
          <Link href={"/pricing"}>Upgrade Plan</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;
