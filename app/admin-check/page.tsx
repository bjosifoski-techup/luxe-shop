'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminCheckPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [dbProfile, setDbProfile] = useState<any>(null);

  const fetchDirectProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setDbProfile(data);
    console.log('Direct DB fetch:', data, error);
  };

  useEffect(() => {
    if (user) {
      fetchDirectProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Please log in to check admin status</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Status Checker</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile from Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</p>
            {profile && (
              <>
                <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                <p><strong>Admin Status:</strong> {' '}
                  <Badge variant={profile.is_admin ? 'default' : 'secondary'}>
                    {profile.is_admin ? 'Admin' : 'Regular User'}
                  </Badge>
                </p>
              </>
            )}
            <Button onClick={refreshProfile} className="mt-4">
              Refresh Profile from Context
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct Database Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Profile Found:</strong> {dbProfile ? 'Yes' : 'No'}</p>
            {dbProfile && (
              <>
                <p><strong>Full Name:</strong> {dbProfile.full_name || 'Not set'}</p>
                <p><strong>Admin Status:</strong> {' '}
                  <Badge variant={dbProfile.is_admin ? 'default' : 'secondary'}>
                    {dbProfile.is_admin ? 'Admin' : 'Regular User'}
                  </Badge>
                </p>
              </>
            )}
            <Button onClick={fetchDirectProfile} className="mt-4">
              Refresh from Database
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>How to Set Admin Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">1. Run this SQL in Supabase SQL Editor:</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`UPDATE user_profiles
SET is_admin = true
WHERE id = '${user.id}';`}
              </pre>
            </div>
            <div>
              <p className="font-semibold mb-2">2. After running the SQL:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click "Refresh from Database" button above</li>
                <li>OR log out and log back in</li>
                <li>OR click "Refresh Profile from Context"</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">3. Verify the change:</p>
              <p>Check that both "Profile from Context" and "Direct Database Query" show "Admin" status.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
