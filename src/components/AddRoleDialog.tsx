import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingRole: "athlete" | "coach";
  onConfirm: () => void;
}

export const AddRoleDialog = ({ open, onOpenChange, pendingRole, onConfirm }: AddRoleDialogProps) => {
  const isAddingCoach = pendingRole === "coach";
  const currentRole = isAddingCoach ? "Athlete" : "Coach";
  const newRole = isAddingCoach ? "Coach" : "Athlete";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#181818] border-[#FF6B00]/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-poppins text-white">
            Add {newRole} role to your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#D0D0D0] font-montserrat text-base">
            You're already registered as {currentRole}. You can keep your {currentRole} profile and also {isAddingCoach ? "coach" : "train"} on Cadence with the same email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#FF6B00]/30 hover:bg-[#FF6B00]/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white shadow-[0_0_12px_rgba(255,107,0,0.4)]"
          >
            Add Role & Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
