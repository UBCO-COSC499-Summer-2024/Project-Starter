import supabase from "@/app/components/supabaseClient";
const getUserType = async () => {
    /**
    This function return the user type of the current user. Since there is RLS for the user_role table, the user can only query their own user type.

    This function takes no input and return one of 'instructor', 'head', or 'stadd' as a string.
    */
    const { data:{user} } = await supabase.auth.getUser()
    console.log(user.id)
    const res = await supabase.from('user_role').select('role').eq('user_id', user.id)
    console.log({"user":res})
    if(res.error)
    {
        console.error('Error fetching user type:', res.error)
        return
    }
    // console.log(res.data[0].role)
    return res.data[0].role
}
export default getUserType