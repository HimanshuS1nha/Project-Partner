"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateNewProjectDialog = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter project's title" required />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">
                Description
                <span className="text-rose-500 text-xs">(Optional)</span>
              </Label>
              <Input
                id="description"
                placeholder="Enter project's description"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="status">Status</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent id="status">
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjectDialog;
