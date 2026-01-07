import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-6xl px-10 md:px-6">
        <div className="mt-6 mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <span className="text-lg">🍰</span>
          </div>
            <h1 className="text-2xl font-semibold text-[#cf9898]">Login</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
          <div className="relative overflow-hidden rounded-2xl bg-[#978282] shadow-sm min-h-[320px">
          <div className="absolute inset-0 bg-[url('/cake-login.jpg')] bg-cover bg-center opacity-70 object-cover"
               aria-hidden
          />
          <div className="relative p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white">
              <span className="text-sm font-medium">Bakery logo</span>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#553030]">Welcome Back!</h2>
            <p className="mt-2 max-w-sm text-sm text-[#553030]">
              Log in to manage products, stock and sales in one place.
            </p>
          </div>
        </div>

        <div className="rounded-2xl  bg-[#CFC5C5] p-6 shadow-sm md:p-8">
          <h3 className="text-xl font-bold text-[#553030]">Welcome Back!</h3>
          <p className="mt-1 text-sm text-gray-600">Enter your details below.</p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]"  htmlFor="email">
                Email
              </label>
              <input
              id="email"
              type="email"
              placeholder="Your email"
              className="w-full rounded-md bg-[#FFFFFF] px-3 py-2 text-sm focus:outline-none focuse:ring-2 text-[#715454] focus:ring-[#c5a2a2]"
              >
              </input>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]"  htmlFor="email">
                Password
              </label>
              <input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full rounded-md text-[#553030] bg-[#FFFFFF] px-3 py-2 text-sm focus:outline-none focuse:ring-2 focus:ring-[#c5a2a2]"
              />   
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#3b1f1f]/30"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/register" className="font-semibold text-[#553030] hover:underline">
                Create account
              </a>
            </p>
          </form>

        </div>


        </div>

    </main>

  )
}
