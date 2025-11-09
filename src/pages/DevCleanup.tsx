import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Database, HardDrive } from "lucide-react";

/**
 * DEV ONLY - Auth Cleanup Utilities
 * Access this page at /dev-cleanup
 * DO NOT use in production!
 */
const DevCleanup = () => {
  const [loading, setLoading] = useState(false);

  const clearLocalCaches = () => {
    setLoading(true);
    
    try {
      // Clear localStorage
      const keysToRemove = [
        'supabase.auth.token',
        'sb-vmkunabmqtqslwrgitpu-auth-token',
        'currentRole',
        'coachDraft',
        'email',
        'password',
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear all cadenceSwipeState entries
      Object.keys(localStorage)
        .filter(key => key.includes('cadenceSwipeState_'))
        .forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB
      if (window.indexedDB) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }

      toast.success("✅ Local caches cleared! Refresh the page.");
      
      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
    } catch (error: any) {
      toast.error("Failed to clear caches");
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signOutAndClear = async () => {
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      clearLocalCaches();
    } catch (error: any) {
      toast.error("Failed to sign out");
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cleanOrphanedRecords = async () => {
    setLoading(true);
    
    try {
      // This will be run manually via SQL editor
      toast.info("Copy the SQL query from the card below and run it in your backend SQL editor");
    } catch (error: any) {
      toast.error("Check console for error");
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🛠️ Dev Cleanup Tools</h1>
          <p className="text-[#D0D0D0]">Reset auth state and clean up test data</p>
        </div>

        {/* Local Cache Cleanup */}
        <Card className="bg-[#181818] border-[#FF6B00]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <HardDrive className="h-5 w-5 text-[#FF6B00]" />
              1. Clear Local Caches
            </CardTitle>
            <CardDescription className="text-[#D0D0D0]">
              Wipe localStorage, sessionStorage, and IndexedDB auth data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#FF6B00]/10">
              <p className="text-sm text-[#D0D0D0] mb-3">This will:</p>
              <ul className="text-sm text-[#D0D0D0] space-y-1 list-disc list-inside">
                <li>Clear all Supabase auth tokens</li>
                <li>Remove role preferences</li>
                <li>Delete swipe state caches</li>
                <li>Clear IndexedDB auth cache</li>
                <li>Redirect to /auth</li>
              </ul>
            </div>
            <Button
              onClick={clearLocalCaches}
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
            >
              Clear Local Caches
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out + Clear */}
        <Card className="bg-[#181818] border-[#FF6B00]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trash2 className="h-5 w-5 text-[#FF6B00]" />
              2. Sign Out + Clear Everything
            </CardTitle>
            <CardDescription className="text-[#D0D0D0]">
              Sign out of Supabase and clear all local caches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={signOutAndClear}
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
            >
              Sign Out + Clear All
            </Button>
          </CardContent>
        </Card>

        {/* Backend Cleanup */}
        <Card className="bg-[#181818] border-[#FF6B00]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-[#FF6B00]" />
              3. Backend Database Cleanup (Manual)
            </CardTitle>
            <CardDescription className="text-[#D0D0D0]">
              Run this SQL in your backend after deleting test users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#FF6B00]/10 overflow-x-auto">
              <pre className="text-xs text-[#D0D0D0] font-mono">
{`-- Step 1: Manually delete test users via backend UI
-- Go to: Authentication → Users
-- Delete any test/invalid accounts

-- Step 2: Run this SQL to clean orphaned records:
DELETE FROM user_roles 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

DELETE FROM coaches
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

-- Verify cleanup:
SELECT COUNT(*) as orphaned_roles
FROM user_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

SELECT COUNT(*) as orphaned_coaches
FROM coaches 
WHERE user_id NOT IN (SELECT id FROM auth.users);`}
              </pre>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM auth.users);\nDELETE FROM coaches WHERE user_id NOT IN (SELECT id FROM auth.users);`);
                toast.success("SQL copied to clipboard!");
              }}
              variant="outline"
              className="w-full border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00]/10"
            >
              Copy SQL to Clipboard
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-[#181818] border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-500">⚠️ Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-[#D0D0D0] space-y-2 list-disc list-inside">
              <li><strong>Cannot delete auth.users via SQL</strong> - Auth schema is protected</li>
              <li><strong>Password hashes are always 60 chars</strong> - Can't filter by "short passwords"</li>
              <li><strong>Manual deletion required</strong> - Use backend UI to delete test users</li>
              <li><strong>Then run cleanup SQL</strong> - Remove orphaned records from public schema</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevCleanup;
