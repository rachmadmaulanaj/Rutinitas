import supabase from '@/lib/supabaseClient'
import moment from 'moment'

export const getDataCategory = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, description, color, icon')
        .order('id', { ascending: false });

    if (error) throw error;
    return data;
};