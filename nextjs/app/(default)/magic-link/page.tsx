import MagicLinkForm from "@/app/components/MagicLinkForm";

export default function Page() {
  return (
    <div className="max-w-[450px] mx-auto">
      <div>
        <p className="mb-3 text-center">
          You’ll usually receive the magic link in your email.
          <br />
          But since this is just a demo, here it is for you!
          <br />
          <br />
          The token is only valid for 5 minutes, so you need to hurry!
        </p>
        <MagicLinkForm />
      </div>
    </div>
  );
}
