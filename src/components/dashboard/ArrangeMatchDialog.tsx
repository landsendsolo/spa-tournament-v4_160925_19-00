'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { arrangeMatch, ActionState } from '@/app/actions/matchActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const initialState: ActionState = { error: '' };

export function ArrangeMatchDialog({ matchId }: { matchId: string }) {
  const [state, formAction] = useActionState(arrangeMatch, initialState);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      // Close the dialog on success
      const timer = setTimeout(() => setIsOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Arrange Match</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Arrange Your Match</DialogTitle>
          <DialogDescription>
            Coordinate with your opponent and enter the agreed date, time, and location.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="matchId" value={matchId} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input id="date" name="date" type="date" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input id="time" name="time" type="time" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" name="location" placeholder="e.g., The Venue" className="col-span-3" required />
            </div>
          </div>
          {state.error && <p className="text-sm text-destructive text-center mb-2">{state.error}</p>}
          {state.success && <p className="text-sm text-primary text-center mb-2">{state.success}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Arrangement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
