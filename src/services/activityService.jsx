import supabase from '@/lib/supabaseClient'
import moment from 'moment'

export const getDataActivityByPeriod = async (month, year) => {
    if (!month || !year) throw new Error('month dan year wajib diisi');

    const startDate = moment(`${year}-${month}`, 'YYYY-M').startOf('month').format('YYYY-MM-DDTHH:mm:ss')
    const endDate = moment(`${year}-${month}`, 'YYYY-M').endOf('month').format('YYYY-MM-DDTHH:mm:ss')

    const { data, error } = await supabase
        .from('activities')
        .select('id, datestart, dateend, name, description, location, category_id, primary')
        .gte('dateend', startDate)
        .lte('dateend', endDate)
        .order('id', { ascending: false });

    if (error) throw error;
    return data;
};

export const getDataActivity = async (id) => {
    const { data, error } = await supabase
        .from('activities')
        .select('id, datestart, dateend, name, description, location, category_id, primary')
        .eq('id', id)
        .order('id', { ascending: false });

    if (error) throw error;
    return data;
};

export const addActivity = async (dataInput) => {
    const { data, error } = await supabase
        .from('activities')
        .insert([dataInput])
        .select('id');

    if (error) throw error;
    return data;
};

export const updateActivity = async (idUpdate, dataUpdate) => {
    const { data, error } = await supabase
        .from('activities')
        .update([dataUpdate])
        .eq('id', idUpdate)
        .select('id');

    if (error) throw error;
    return data;
};

export const deleteActivity = async (id) => {
    const { data, error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)
        .select('id');

    if (error) throw error;
    return data;
};