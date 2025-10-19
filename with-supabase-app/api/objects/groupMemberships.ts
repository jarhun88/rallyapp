import { createClient } from "@/lib/supabase/client";

// TypeScript interfaces for GroupMembership entity based on actual table schema
export interface GroupMembership {
  user_id: string;
  group_id: string;
  created_at: string;
}

export interface CreateGroupMembershipData {
  group_id: string;
  user_id: string;
}

// Create a new group membership
export async function createGroupMembership(membershipData: CreateGroupMembershipData): Promise<GroupMembership> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('objects.groupMemberships')
      .insert({
        group_id: membershipData.group_id,
        user_id: membershipData.user_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create group membership: ${error.message}`);
    }

    return {
      user_id: data.user_id,
      group_id: data.group_id,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error creating group membership:', error);
    throw error;
  }
}

// Get memberships for a specific group
export async function getGroupMembershipsByGroup(groupId: string): Promise<GroupMembership[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('objects.groupMemberships')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to read group memberships for group: ${error.message}`);
    }

    return data.map((item: any) => ({
      user_id: item.user_id,
      group_id: item.group_id,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error reading group memberships for group:', error);
    throw error;
  }
}

// Get memberships for a specific user
export async function getUserGroupMemberships(userId: string): Promise<GroupMembership[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('objects.groupMemberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to read user group memberships: ${error.message}`);
    }

    return data.map((item: any) => ({
      user_id: item.user_id,
      group_id: item.group_id,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error reading user group memberships:', error);
    throw error;
  }
}

// Delete a group membership
export async function deleteGroupMembership(userId: string, groupId: string): Promise<void> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('objects.groupMemberships')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId);

    if (error) {
      throw new Error(`Failed to delete group membership: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting group membership:', error);
    throw error;
  }
}

// Check if a user is a member of a group
export async function isUserMemberOfGroup(userId: string, groupId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('objects.groupMemberships')
      .select('user_id')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // Not a member
      }
      throw new Error(`Failed to check group membership: ${error.message}`);
    }

    return !!data;
  } catch (error) {
    console.error('Error checking group membership:', error);
    throw error;
  }
}
