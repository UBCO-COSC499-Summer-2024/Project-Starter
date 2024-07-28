import supabase from "@/app/components/supabaseClient";
const getUserType = async () => {
    const res = await supabase.from('user_role').select('role')
    if(res.error)
    {
        console.error('Error fetching user type:', res.error)
        return
    }
    // console.log(res.data[0].role)
    return res.data[0].role
}
export default getUserType