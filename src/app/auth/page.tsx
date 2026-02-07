export default function AuthPage() {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-12 md:px-6">
      <div className="hs-card rounded-[18px] p-8">
        <div className="font-display text-2xl font-semibold text-white">Auth</div>
        <div className="mt-2 text-sm text-[var(--hs-gray)]">
          Next step: Supabase Auth (email/magic link), session persistence, and global sign-out.
        </div>
      </div>
    </div>
  )
}
