import { createClient } from "@/lib/supabase/client";

// TypeScript interfaces based on the actual Supabase table schema
export interface Group {
  id: string;
  created_at: string;
  name: string;
  description?: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
}

// Create a new group
export async function createGroup(groupData: CreateGroupData): Promise<Group> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .schema('objects')
      .from('groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }

    return {
      id: data.id,
      created_at: data.created_at,
      name: data.name,
      description: data.description,
    };
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

// Read a single group by ID
export async function readGroup(groupId: string): Promise<Group | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .schema('objects')
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Group not found
      }
      throw new Error(`Failed to read group: ${error.message}`);
    }

    return {
      id: data.id,
      created_at: data.created_at,
      name: data.name,
      description: data.description,
    };
  } catch (error) {
    console.error('Error reading group:', error);
    throw error;
  }
}

// Read groups with pagination
export async function getGroups(
  page: number = 1, 
  limit: number = 10
): Promise<{ groups: Group[]; total: number; page: number; limit: number }> {
  const supabase = createClient();
  
  try {
    const offset = (page - 1) * limit;

    // Get total count
    // const { count, error: countError } = await supabase
    //   .schema('objects')
    //   .from('groups')
    //   .select('*', { count: 'exact', head: true });

    // if (countError) {
    //   throw new Error(`Failed to get groups count: ${countError.message}`);
    // }

    // Get paginated data
    const { data, error } = await supabase
      .schema('objects')
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to read groups: ${error.message}`);
    }

    return {
      groups: data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        description: item.description,
      })),
      total: data.length,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error reading groups with pagination:', error);
    throw error;
  }
}

// Search groups by name or description
export async function searchGroups(query: string): Promise<Group[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .schema('objects')
      .from('groups')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search groups: ${error.message}`);
    }

    return data.map((item: any) => ({
      id: item.id,
      created_at: item.created_at,
      name: item.name,
      description: item.description,
    }));
  } catch (error) {
    console.error('Error searching groups:', error);
    throw error;
  }
}

// Update a group
export async function updateGroup(groupId: string, updateData: UpdateGroupData): Promise<Group> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .schema('objects')
      .from('groups')
      .update({
        name: updateData.name,
        description: updateData.description,
      })
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update group: ${error.message}`);
    }

    return {
      id: data.id,
      created_at: data.created_at,
      name: data.name,
      description: data.description,
    };
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
}

// Delete a group
export async function deleteGroup(groupId: string): Promise<void> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .schema('objects')
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) {
      throw new Error(`Failed to delete group: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}
