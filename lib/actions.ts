"use server";

export async function editNote(formData: FormData) {
  const rawFormData = {
    userid: formData.get("user.id"),
    noteId: formData.get("note.id"),
    text: formData.get("text"),
    fieldType: formData.get("fieldType"),
  };
  // Test it out:
  console.log(rawFormData);
}
