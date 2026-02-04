import { getAuthUser } from "@/lib/auth";
import ProfileForm from "./profile/profile-form";


export default async function ProfileSettingsPage() {
  const user = await getAuthUser();
    

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
              <img
                    src="/cupcake-logo.png"
                    alt="Bakery logo"
                    className="h-7 w-16 object-contain"
                />
        <p className="text-2xl font-extrabold text-[#553030]">You must be logged in</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm border">
        <div className="flex  flex-start gap-1 mb-4">
                <img
                    src="/cupcake-logo.png"
                    alt="Bakery logo"
                    className="h-7 w-16 object-contain"
                />
                <h1 className="text-2xl font-extrabold text-[#553030] text-center">
                   Profile setting 
                </h1>
            </div>
        <p className="text-sm text-gray-500 mb-6">
          Update your personal information
        </p>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
