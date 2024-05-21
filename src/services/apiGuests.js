import supabase from "./supabase";

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([
      {
        fullName: newGuest.fullName,
        email: newGuest.email,
        nationality: newGuest.nationality,
        nationalID: newGuest.nationalID,
        countryFlag: newGuest.countryFlag,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guests could not be created");
  }
  return data;
}
